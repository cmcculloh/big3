import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { requireAuth } from '$lib/server/auth-utils';
import { eq, desc, and, gte, lte, asc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema.js';

export async function load({ params, locals }) {
    try {
        // Get user from session
        const user = requireAuth(locals.user);
        const workoutId = params.id;
        const userId = user.id;

        // Get workout session
        const workoutSession = await db
            .select({
                id: schema.workoutSession.id,
                routineId: schema.workoutSession.routineId,
                startedAt: schema.workoutSession.startedAt,
                completedAt: schema.workoutSession.completedAt,
                notes: schema.workoutSession.notes,
                routine: {
                    id: schema.routine.id,
                    name: schema.routine.name,
                    description: schema.routine.description
                }
            })
            .from(schema.workoutSession)
            .leftJoin(schema.routine, eq(schema.workoutSession.routineId, schema.routine.id))
            .where(eq(schema.workoutSession.id, workoutId))
            .limit(1);

        if (!workoutSession[0]) {
            throw error(404, 'Workout not found');
        }

        const session = workoutSession[0];

        // Get set performance data for the workout session
        const setPerformances = await db
            .select({
                id: schema.setPerformance.id,
                setNumber: schema.setPerformance.setNumber,
                reps: schema.setPerformance.reps,
                duration: schema.setPerformance.duration,
                weight: schema.setPerformance.weight,
                bandStrength: schema.setPerformance.bandStrength,
                difficulty: schema.setPerformance.difficulty,
                notes: schema.setPerformance.notes,
                completedAt: schema.setPerformance.completedAt,
                exerciseTemplate: {
                    id: schema.exerciseTemplate.id,
                    sets: schema.exerciseTemplate.sets,
                    reps: schema.exerciseTemplate.reps,
                    duration: schema.exerciseTemplate.duration,
                    weight: schema.exerciseTemplate.weight,
                    bandStrength: schema.exerciseTemplate.bandStrength,
                    notes: schema.exerciseTemplate.notes
                },
                exercise: {
                    id: schema.exercise.id,
                    name: schema.exercise.name,
                    description: schema.exercise.description,
                    category: schema.exercise.category
                }
            })
            .from(schema.setPerformance)
            .innerJoin(schema.exerciseTemplate, eq(schema.setPerformance.exerciseTemplateId, schema.exerciseTemplate.id))
            .innerJoin(schema.exercise, eq(schema.exerciseTemplate.exerciseId, schema.exercise.id))
            .where(eq(schema.setPerformance.workoutSessionId, workoutId))
            .orderBy(schema.setPerformance.setNumber);

        // Group exercises by template
        const exerciseMap = new Map();
        setPerformances.forEach(performance => {
            const templateId = performance.exerciseTemplate.id;
            if (!exerciseMap.has(templateId)) {
                exerciseMap.set(templateId, {
                    name: performance.exercise.name,
                    sets: performance.exerciseTemplate.sets,
                    reps: performance.exerciseTemplate.reps,
                    duration: performance.exerciseTemplate.duration,
                    weight: performance.exerciseTemplate.weight,
                    bandStrength: performance.exerciseTemplate.bandStrength,
                    notes: performance.exerciseTemplate.notes,
                    performances: []
                });
            }
            exerciseMap.get(templateId).performances.push(performance);
        });

        // Calculate workout statistics
        const exercises = Array.from(exerciseMap.values()).map(exercise => {
            const avgDifficulty = exercise.performances
                .filter(p => p.difficulty)
                .reduce((sum, p) => {
                    const difficultyMap = { '😊': 1, '😐': 2, '☹️': 3 };
                    return sum + (difficultyMap[p.difficulty] || 2);
                }, 0) / exercise.performances.filter(p => p.difficulty).length || 2;

            const difficulty = avgDifficulty <= 1.5 ? '😊' : avgDifficulty <= 2.5 ? '😐' : '☹️';

            return {
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                duration: exercise.duration,
                weight: exercise.weight,
                bandStrength: exercise.bandStrength,
                difficulty: difficulty,
                notes: exercise.notes
            };
        });

        // Calculate duration
        let duration = 0;
        if (session.completedAt && session.startedAt) {
            duration = Math.round((new Date(session.completedAt) - new Date(session.startedAt)) / (1000 * 60));
        }

        // Calculate totals
        const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
        const totalExercises = exercises.length;

        const workout = {
            id: session.id,
            routineName: session.routine?.name || 'Custom Workout',
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            duration: duration,
            exercises: exercises,
            notes: session.notes,
            totalSets: totalSets,
            totalExercises: totalExercises
        };

        return { workout };
    } catch (err) {
        console.error('Error loading workout details:', err);
        if (err.status === 401 || err.status === 404) {
            throw err;
        }
        throw error(500, 'Failed to load workout details');
    }
}
