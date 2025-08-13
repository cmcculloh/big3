import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { routine, exercise, exerciseTemplate, routineExercise } from '$lib/server/db/schema.js';

export async function POST({ request }) {
    try {
        const { workout, userId = 'demo-user' } = await request.json();

        if (!workout) {
            return json({ error: 'Workout data is required' }, { status: 400 });
        }

        // For now, we'll use a demo user ID since authentication isn't fully implemented
        // In a real app, you'd get this from the authenticated session

        // Create the routine
        const [newRoutine] = await db.insert(routine).values({
            userId: userId,
            name: workout.name,
            description: workout.description,
            category: workout.category || 'full_body',
            estimatedDuration: workout.estimatedDuration || 30,
            isActive: true
        }).returning();

        // Add exercises to the routine
        if (workout.exercises && workout.exercises.length > 0) {
            for (let i = 0; i < workout.exercises.length; i++) {
                const exerciseData = workout.exercises[i];

                // Clean and parse numeric values from AI-generated text
                const cleanWeight = parseWeight(exerciseData.weight);
                const cleanSets = parseInt(exerciseData.sets) || 3;
                const cleanReps = parseInt(exerciseData.reps) || 10;
                const cleanDuration = parseInt(exerciseData.duration) || null;
                const cleanRestBetweenSets = parseInt(exerciseData.restBetweenSets) || 60;

                // First, create or find the exercise
                let [exerciseRecord] = await db.insert(exercise).values({
                    name: exerciseData.name,
                    description: exerciseData.description,
                    category: exerciseData.category || 'strength',
                    equipmentId: null, // We'll handle equipment later
                    instructions: exerciseData.notes
                }).returning();

                // Create the exercise template
                const [template] = await db.insert(exerciseTemplate).values({
                    exerciseId: exerciseRecord.id,
                    userId: userId,
                    sets: cleanSets,
                    reps: cleanReps,
                    duration: cleanDuration,
                    weight: cleanWeight,
                    bandStrength: exerciseData.bandStrength || null,
                    restBetweenSets: cleanRestBetweenSets,
                    notes: exerciseData.notes || ''
                }).returning();

                // Link the template to the routine
                await db.insert(routineExercise).values({
                    routineId: newRoutine.id,
                    exerciseTemplateId: template.id,
                    order: i + 1
                });
            }
        }

        return json({
            success: true,
            routine: {
                id: newRoutine.id,
                name: newRoutine.name,
                description: newRoutine.description,
                category: newRoutine.category,
                estimatedDuration: newRoutine.estimatedDuration,
                exerciseCount: workout.exercises?.length || 0
            },
            message: 'Workout saved successfully as routine'
        });

    } catch (error) {
        console.error('Save Workout Error:', error);
        return json({
            error: 'Failed to save workout',
            details: error.message
        }, { status: 500 });
    }
}

// Helper function to parse weight values from AI-generated text
function parseWeight(weightValue) {
    if (!weightValue) return null;

    // If it's already a number, return it
    if (typeof weightValue === 'number') return weightValue;

    // If it's a string, try to extract a number
    if (typeof weightValue === 'string') {
        // Look for patterns like "5-8 lbs", "10kg", "15 lbs", etc.
        const weightMatch = weightValue.match(/(\d+(?:\.\d+)?)/);
        if (weightMatch) {
            return parseFloat(weightMatch[1]);
        }
    }

    // If we can't parse it, return null
    return null;
}
