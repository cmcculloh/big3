import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { routine, exercise, exerciseTemplate, routineExercise, equipment } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
    try {
        const routineId = parseInt(params.id);

        if (isNaN(routineId)) {
            throw error(400, 'Invalid routine ID');
        }

        // Get the routine
        const [routineData] = await db.select().from(routine).where(eq(routine.id, routineId));

        if (!routineData) {
            throw error(404, 'Routine not found');
        }

        // Get the routine exercises with full exercise details and equipment
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

        // Get equipment details for each exercise
        const exercisesWithEquipment = await Promise.all(
            routineExercises.map(async (re) => {
                // Get equipment info if available
                let equipmentInfo = { name: 'Bodyweight', type: 'bodyweight' };

                // Note: equipmentId is not directly available in the joined data
                // We'll use a default for now, but this could be enhanced later
                // to store equipment info in the exercise template or routine exercise

                return {
                    id: re.exercise.id,
                    exercise: {
                        id: re.exercise.id,
                        name: re.exercise.name,
                        description: re.exercise.description,
                        category: re.exercise.category,
                        instructions: re.exercise.instructions
                    },
                    template: {
                        id: re.template.id,
                        sets: re.template.sets,
                        reps: re.template.reps,
                        duration: re.template.duration,
                        weight: re.template.weight,
                        bandStrength: re.template.bandStrength,
                        restBetweenSets: re.template.restBetweenSets,
                        notes: re.template.notes
                    },
                    equipment: equipmentInfo
                };
            })
        );

        // Format the response to match what the frontend expects
        const formattedRoutine = {
            id: routineData.id,
            name: routineData.name,
            description: routineData.description,
            category: routineData.category,
            estimatedDuration: routineData.estimatedDuration,
            exercises: exercisesWithEquipment
        };

        return {
            routine: formattedRoutine
        };

    } catch (err) {
        console.error('Error loading workout routine:', err);
        throw error(500, 'Failed to load workout routine');
    }
}
