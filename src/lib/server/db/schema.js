import { pgTable, serial, integer, text, timestamp, boolean, json, real } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	resetToken: text('reset_token'),
	resetTokenExpires: timestamp('reset_token_expires', { withTimezone: true, mode: 'date' })
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Equipment types (weights, bands, bodyweight, etc.)
export const equipment = pgTable('equipment', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type').notNull(), // 'weights', 'bands', 'bodyweight', 'cardio'
	description: text('description')
});

// Individual exercises
export const exercise = pgTable('exercise', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	category: text('category').notNull(), // 'strength', 'cardio', 'flexibility', etc.
	equipmentId: integer('equipment_id').references(() => equipment.id),
	instructions: text('instructions'),
	videoUrl: text('video_url'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// Exercise templates with default parameters
export const exerciseTemplate = pgTable('exercise_template', {
	id: serial('id').primaryKey(),
	exerciseId: integer('exercise_id').notNull().references(() => exercise.id),
	userId: text('user_id').notNull().references(() => user.id),
	type: text('type').default('reps'), // 'reps' or 'time'
	sets: integer('sets').notNull().default(3),
	reps: integer('reps'), // null if duration-based
	duration: integer('duration'), // in seconds, null if rep-based
	weight: real('weight'), // in lbs/kg
	bandStrength: text('band_strength'), // 'light', 'medium', 'heavy'
	restBetweenSets: integer('rest_between_sets').default(60), // in seconds
	restBetweenReps: integer('rest_between_reps').default(0), // for duration exercises
	notes: text('notes'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// Workout routines
export const routine = pgTable('routine', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	name: text('name').notNull(),
	description: text('description'),
	category: text('category'), // 'strength', 'cardio', 'full_body', etc.
	estimatedDuration: integer('estimated_duration'), // in minutes
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// Routine exercises (many-to-many relationship)
export const routineExercise = pgTable('routine_exercise', {
	id: serial('id').primaryKey(),
	routineId: integer('routine_id').notNull().references(() => routine.id),
	exerciseTemplateId: integer('exercise_template_id').notNull().references(() => exerciseTemplate.id),
	order: integer('order').notNull(), // for ordering exercises in routine
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// Workout sessions
export const workoutSession = pgTable('workout_session', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	routineId: integer('routine_id').references(() => routine.id),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }).notNull(),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
	notes: text('notes')
});

// Individual set performance tracking
export const setPerformance = pgTable('set_performance', {
	id: serial('id').primaryKey(),
	workoutSessionId: integer('workout_session_id').notNull().references(() => workoutSession.id),
	exerciseTemplateId: integer('exercise_template_id').notNull().references(() => exerciseTemplate.id),
	setNumber: integer('set_number').notNull(),
	reps: integer('reps'), // actual reps completed
	duration: integer('duration'), // actual duration in seconds
	weight: real('weight'), // actual weight used
	bandStrength: text('band_strength'), // actual band strength used
	difficulty: text('difficulty'), // '😊', '😐', '☹️'
	notes: text('notes'),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// User preferences and settings
export const userSettings = pgTable('user_settings', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id).unique(),
	weightUnit: text('weight_unit').default('lbs'), // 'lbs' or 'kg'
	restBetweenSets: integer('rest_between_sets').default(60), // default rest time
	autoIncreaseWeight: boolean('auto_increase_weight').default(true),
	autoDecreaseWeight: boolean('auto_decrease_weight').default(true),
	weightIncreaseAmount: real('weight_increase_amount').default(5), // amount to increase/decrease
	soundEnabled: boolean('sound_enabled').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});
