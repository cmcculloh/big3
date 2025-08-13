import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { exercise, exerciseTemplate, routineExercise } from '$lib/server/db/schema.js';
import { eq, inArray } from 'drizzle-orm';

// Helper function to parse weight values
function parseWeight(weightValue) {
    if (!weightValue || weightValue === '') return null;
    if (typeof weightValue === 'number') return weightValue;

    const weightStr = weightValue.toString().toLowerCase();
    if (weightStr.includes('lbs') || weightStr.includes('lb')) {
        return parseFloat(weightStr.replace(/[^\d.]/g, ''));
    }
    if (weightStr.includes('kg')) {
        return parseFloat(weightStr.replace(/[^\d.]/g, '')) * 2.20462; // Convert kg to lbs
    }
    return parseFloat(weightStr) || null;
}

export async function PUT({ params, request }) {
    try {
        const routineId = parseInt(params.id);
        if (isNaN(routineId)) {
            return json({ error: 'Invalid routine ID' }, { status: 400 });
        }

        const { exercises } = await request.json();

        if (!Array.isArray(exercises)) {
            return json({ error: 'Exercises must be an array' }, { status: 400 });
        }

        // Start a transaction
        const result = await db.transaction(async (tx) => {
            // First, get all existing exercise template IDs for this routine
            const existingRoutineExercises = await tx.select({
                exerciseTemplateId: routineExercise.exerciseTemplateId
            })
            .from(routineExercise)
            .where(eq(routineExercise.routineId, routineId));

            // Delete routine exercise links first
            await tx.delete(routineExercise).where(eq(routineExercise.routineId, routineId));

            // Now delete the orphaned exercise templates
            if (existingRoutineExercises.length > 0) {
                const templateIds = existingRoutineExercises.map(re => re.exerciseTemplateId);
                await tx.delete(exerciseTemplate).where(inArray(exerciseTemplate.id, templateIds));
            }

            // Now add the new exercises
            const newExercises = [];

            for (let i = 0; i < exercises.length; i++) {
                const exerciseData = exercises[i];

                // Clean and parse numeric values
                const cleanWeight = parseWeight(exerciseData.weight);
                const cleanSets = parseInt(exerciseData.sets) || 3;
                const cleanReps = parseInt(exerciseData.reps) || 10;
                const cleanDuration = parseInt(exerciseData.duration) || null;
                const cleanRestBetweenSets = parseInt(exerciseData.restBetweenSets) || 60;

                // Create the exercise record
                const [exerciseRecord] = await tx.insert(exercise).values({
                    name: exerciseData.name,
                    description: exerciseData.description || null,
                    category: exerciseData.category || 'strength',
                    userId: 'demo-user' // For now, hardcoded
                }).returning();

                // Create the exercise template
                const [template] = await tx.insert(exerciseTemplate).values({
                    exerciseId: exerciseRecord.id,
                    userId: 'demo-user',
                    sets: cleanSets,
                    reps: cleanReps,
                    duration: cleanDuration,
                    weight: cleanWeight,
                    bandStrength: exerciseData.bandStrength || null,
                    restBetweenSets: cleanRestBetweenSets,
                    notes: exerciseData.notes || ''
                }).returning();

                // Link to routine
                await tx.insert(routineExercise).values({
                    routineId: routineId,
                    exerciseTemplateId: template.id,
                    order: i + 1
                });

                newExercises.push({
                    id: exerciseRecord.id,
                    name: exerciseRecord.name,
                    description: exerciseRecord.description,
                    category: exerciseRecord.category,
                    sets: cleanSets,
                    reps: cleanReps,
                    duration: cleanDuration,
                    weight: cleanWeight,
                    bandStrength: exerciseData.bandStrength,
                    restBetweenSets: cleanRestBetweenSets,
                    notes: exerciseData.notes || ''
                });
            }

            return newExercises;
        });

        return json({
            success: true,
            exercises: result,
            message: 'Exercises updated successfully'
        });

    } catch (error) {
        console.error('Error updating routine exercises:', error);
        return json({
            error: 'Failed to update exercises',
            details: error.message
        }, { status: 500 });
    }
}
