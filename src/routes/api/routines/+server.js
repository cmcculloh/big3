import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { routine, routineExercise, exerciseTemplate, exercise } from '$lib/server/db/schema.js';
import { eq, desc, count } from 'drizzle-orm';

export async function GET() {
    try {
        // For now, we'll get routines for the demo user
        // In a real app, you'd get this from the authenticated session
        const userId = 'demo-user';

        // Get all routines for the user
        const routinesData = await db
            .select({
                id: routine.id,
                name: routine.name,
                description: routine.description,
                category: routine.category,
                estimatedDuration: routine.estimatedDuration,
                isActive: routine.isActive,
                createdAt: routine.createdAt
            })
            .from(routine)
            .where(eq(routine.userId, userId))
            .orderBy(desc(routine.createdAt));

        // Get exercise counts and full exercise data for each routine
        const routinesWithCounts = await Promise.all(
            routinesData.map(async (routineData) => {
                // Get exercise count
                const exerciseCount = await db
                    .select({ count: count() })
                    .from(routineExercise)
                    .where(eq(routineExercise.routineId, routineData.id));

                // Get full exercise data including type field
                const exercises = await db
                    .select({
                        id: routineExercise.id,
                        order: routineExercise.order,
                        exerciseId: exercise.id,
                        exerciseName: exercise.name,
                        exerciseDescription: exercise.description,
                        exerciseCategory: exercise.category,
                        templateId: exerciseTemplate.id,
                        templateType: exerciseTemplate.type,
                        templateSets: exerciseTemplate.sets,
                        templateReps: exerciseTemplate.reps,
                        templateDuration: exerciseTemplate.duration,
                        templateWeight: exerciseTemplate.weight,
                        templateBandStrength: exerciseTemplate.bandStrength,
                        templateRestBetweenSets: exerciseTemplate.restBetweenSets,
                        templateNotes: exerciseTemplate.notes
                    })
                    .from(routineExercise)
                    .innerJoin(exerciseTemplate, eq(routineExercise.exerciseTemplateId, exerciseTemplate.id))
                    .innerJoin(exercise, eq(exerciseTemplate.exerciseId, exercise.id))
                    .where(eq(routineExercise.routineId, routineData.id))
                    .orderBy(routineExercise.order);

                // Transform the flat data back to nested structure
                const exercisesWithNestedStructure = exercises.map(ex => ({
                    id: ex.id,
                    order: ex.order,
                    exercise: {
                        id: ex.exerciseId,
                        name: ex.exerciseName,
                        description: ex.exerciseDescription,
                        category: ex.exerciseCategory
                    },
                    template: {
                        id: ex.templateId,
                        type: ex.templateType,
                        sets: ex.templateSets,
                        reps: ex.templateReps,
                        duration: ex.templateDuration,
                        weight: ex.templateWeight,
                        bandStrength: ex.templateBandStrength,
                        restBetweenSets: ex.templateRestBetweenSets,
                        notes: ex.templateNotes
                    }
                }));

                // Debug: Log the exercise data being returned
                console.log(`=== ROUTINE ${routineData.id} EXERCISES ===`);
                exercises.forEach((ex, index) => {
                    console.log(`Exercise ${index}:`, {
                        id: ex.id,
                        type: ex.templateType,
                        sets: ex.templateSets,
                        reps: ex.templateReps,
                        duration: ex.templateDuration
                    });
                });

                return {
                    ...routineData,
                    exerciseCount: exerciseCount[0]?.count || 0,
                    exercises: exercisesWithNestedStructure,
                    lastUsed: routineData.createdAt ?
                        new Date(routineData.createdAt).toISOString().split('T')[0] :
                        'Never'
                };
            })
        );

        return json({
            success: true,
            routines: routinesWithCounts
        });

    } catch (error) {
        console.error('Get Routines Error:', error);
        return json({
            error: 'Failed to fetch routines',
            details: error.message
        }, { status: 500 });
    }
}
