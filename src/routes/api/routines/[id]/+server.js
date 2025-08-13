import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { routine, exercise, exerciseTemplate, routineExercise } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
    try {
        const routineId = parseInt(params.id);

        if (isNaN(routineId)) {
            return json({ error: 'Invalid routine ID' }, { status: 400 });
        }

        // Get the routine
        const [routineData] = await db.select().from(routine).where(eq(routine.id, routineId));

        if (!routineData) {
            return json({ error: 'Routine not found' }, { status: 404 });
        }

        // Get the routine exercises with full exercise details
        const routineExercises = await db
            .select({
                id: routineExercise.id,
                order: routineExercise.order,
                exercise: {
                    id: exercise.id,
                    name: exercise.name,
                    description: exercise.description,
                    category: exercise.category,
                    instructions: exercise.instructions
                },
                template: {
                    id: exerciseTemplate.id,
                    sets: exerciseTemplate.sets,
                    reps: exerciseTemplate.reps,
                    duration: exerciseTemplate.duration,
                    weight: exerciseTemplate.weight,
                    bandStrength: exerciseTemplate.bandStrength,
                    restBetweenSets: exerciseTemplate.restBetweenSets,
                    notes: exerciseTemplate.notes
                }
            })
            .from(routineExercise)
            .innerJoin(exerciseTemplate, eq(routineExercise.exerciseTemplateId, exerciseTemplate.id))
            .innerJoin(exercise, eq(exerciseTemplate.exerciseId, exercise.id))
            .where(eq(routineExercise.routineId, routineId))
            .orderBy(routineExercise.order);

        // Format the response to match what the frontend expects
        const formattedRoutine = {
            id: routineData.id,
            name: routineData.name,
            description: routineData.description,
            category: routineData.category,
            estimatedDuration: routineData.estimatedDuration,
            exercises: routineExercises.map(re => ({
                id: re.exercise.id,
                name: re.exercise.name,
                description: re.exercise.description,
                category: re.exercise.category,
                sets: re.template.sets,
                reps: re.template.reps,
                duration: re.template.duration,
                restBetweenSets: re.template.restBetweenSets,
                equipment: 'bodyweight', // Default for now
                weight: re.template.weight,
                bandStrength: re.template.bandStrength,
                notes: re.template.notes
            }))
        };

        return json({
            success: true,
            routine: formattedRoutine
        });

    } catch (error) {
        console.error('Get Routine Error:', error);
        return json({
            error: 'Failed to fetch routine',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    try {
        const routineId = parseInt(params.id);

        if (isNaN(routineId)) {
            return json({ error: 'Invalid routine ID' }, { status: 400 });
        }

        // First, delete all routine exercises
        await db.delete(routineExercise).where(eq(routineExercise.routineId, routineId));

        // Then delete the routine
        await db.delete(routine).where(eq(routine.id, routineId));

        return json({
            success: true,
            message: 'Routine deleted successfully'
        });

    } catch (error) {
        console.error('Delete Routine Error:', error);
        return json({
            error: 'Failed to delete routine',
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT({ params, request }) {
    try {
        const routineId = parseInt(params.id);

        if (isNaN(routineId)) {
            return json({ error: 'Invalid routine ID' }, { status: 400 });
        }

        const { name, description, category, estimatedDuration } = await request.json();

        if (!name || !name.trim()) {
            return json({ error: 'Routine name is required' }, { status: 400 });
        }

        // Update the routine
        const [updatedRoutine] = await db
            .update(routine)
            .set({
                name: name.trim(),
                description: description?.trim() || null,
                category: category || null,
                estimatedDuration: estimatedDuration || null
            })
            .where(eq(routine.id, routineId))
            .returning();

        if (!updatedRoutine) {
            return json({ error: 'Routine not found' }, { status: 404 });
        }

        return json({
            success: true,
            routine: updatedRoutine,
            message: 'Routine updated successfully'
        });

    } catch (error) {
        console.error('Update Routine Error:', error);
        return json({
            error: 'Failed to update routine',
            details: error.message
        }, { status: 500 });
    }
}
