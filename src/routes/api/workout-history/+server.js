import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { requireAuth } from '$lib/server/auth-utils';
import { eq, desc, and, gte, lte, asc } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema.js';

export async function GET({ url, locals }) {
    try {
        // Get user from session
        const user = requireAuth(locals.user);
        const timeframe = url.searchParams.get('timeframe') || 'all';
        const userId = user.id;

        // Calculate date range based on timeframe
        let startDate = null;
        let endDate = null;

        if (timeframe !== 'all') {
            const now = new Date();
            endDate = now;

            switch (timeframe) {
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
            }
        }

        // Build query conditions
        let whereConditions = [eq(schema.workoutSession.userId, userId)];
        if (startDate && endDate) {
            whereConditions.push(gte(schema.workoutSession.startedAt, startDate));
            whereConditions.push(lte(schema.workoutSession.startedAt, endDate));
        }

        // Get workout sessions
        const workoutSessions = await db
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
            .where(and(...whereConditions))
            .orderBy(desc(schema.workoutSession.startedAt));

        // Get set performance data for each workout session
        const workoutHistory = await Promise.all(
            workoutSessions.map(async (session) => {
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
                    .where(eq(schema.setPerformance.workoutSessionId, session.id))
                    .orderBy(asc(schema.setPerformance.setNumber));

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

                return {
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
            })
        );

        return json({ workoutHistory });
    } catch (error) {
        console.error('Error fetching workout history:', error);
        return json({ error: 'Failed to fetch workout history' }, { status: 500 });
    }
}
