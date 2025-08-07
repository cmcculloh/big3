import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc, asc, and } from 'drizzle-orm';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Utility functions for common database operations
export async function getUserById(userId) {
	const result = await db.select().from(schema.user).where(eq(schema.user.id, userId));
	return result[0] || null;
}

export async function getUserSettings(userId) {
	const result = await db.select().from(schema.userSettings).where(eq(schema.userSettings.userId, userId));
	return result[0] || null;
}

export async function getRoutinesByUserId(userId) {
	return await db
		.select({
			id: schema.routine.id,
			name: schema.routine.name,
			description: schema.routine.description,
			category: schema.routine.category,
			estimatedDuration: schema.routine.estimatedDuration,
			isActive: schema.routine.isActive,
			createdAt: schema.routine.createdAt
		})
		.from(schema.routine)
		.where(eq(schema.routine.userId, userId))
		.orderBy(desc(schema.routine.createdAt));
}

export async function getRoutineWithExercises(routineId) {
	const routine = await db
		.select()
		.from(schema.routine)
		.where(eq(schema.routine.id, routineId));

	if (!routine[0]) return null;

	const exercises = await db
		.select({
			id: schema.routineExercise.id,
			order: schema.routineExercise.order,
			exerciseTemplateId: schema.routineExercise.exerciseTemplateId,
			exercise: {
				id: schema.exercise.id,
				name: schema.exercise.name,
				description: schema.exercise.description,
				category: schema.exercise.category,
				instructions: schema.exercise.instructions,
				videoUrl: schema.exercise.videoUrl
			},
			template: {
				id: schema.exerciseTemplate.id,
				sets: schema.exerciseTemplate.sets,
				reps: schema.exerciseTemplate.reps,
				duration: schema.exerciseTemplate.duration,
				weight: schema.exerciseTemplate.weight,
				bandStrength: schema.exerciseTemplate.bandStrength,
				restBetweenSets: schema.exerciseTemplate.restBetweenSets,
				restBetweenReps: schema.exerciseTemplate.restBetweenReps,
				notes: schema.exerciseTemplate.notes
			},
			equipment: {
				id: schema.equipment.id,
				name: schema.equipment.name,
				type: schema.equipment.type,
				description: schema.equipment.description
			}
		})
		.from(schema.routineExercise)
		.innerJoin(schema.exerciseTemplate, eq(schema.routineExercise.exerciseTemplateId, schema.exerciseTemplate.id))
		.innerJoin(schema.exercise, eq(schema.exerciseTemplate.exerciseId, schema.exercise.id))
		.leftJoin(schema.equipment, eq(schema.exercise.equipmentId, schema.equipment.id))
		.where(eq(schema.routineExercise.routineId, routineId))
		.orderBy(asc(schema.routineExercise.order));

	return {
		...routine[0],
		exercises
	};
}

export async function getLastWorkoutPerformance(userId, exerciseTemplateId) {
	const result = await db
		.select({
			difficulty: schema.setPerformance.difficulty,
			weight: schema.setPerformance.weight,
			bandStrength: schema.setPerformance.bandStrength,
			completedAt: schema.setPerformance.completedAt
		})
		.from(schema.setPerformance)
		.innerJoin(schema.workoutSession, eq(schema.setPerformance.workoutSessionId, schema.workoutSession.id))
		.where(
			and(
				eq(schema.workoutSession.userId, userId),
				eq(schema.setPerformance.exerciseTemplateId, exerciseTemplateId)
			)
		)
		.orderBy(desc(schema.setPerformance.completedAt))
		.limit(1);

	return result[0] || null;
}
