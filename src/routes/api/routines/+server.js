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

        // Get exercise counts for each routine
        const routinesWithCounts = await Promise.all(
            routinesData.map(async (routineData) => {
                const exerciseCount = await db
                    .select({ count: count() })
                    .from(routineExercise)
                    .where(eq(routineExercise.routineId, routineData.id));

                return {
                    ...routineData,
                    exerciseCount: exerciseCount[0]?.count || 0,
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
