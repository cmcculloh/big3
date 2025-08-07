import { json } from '@sveltejs/kit';
import { workoutAI } from '$lib/server/ai.js';

export async function POST({ request }) {
    try {
        const { routine, userHistory, optimizationRequest } = await request.json();

        if (!routine || !optimizationRequest) {
            return json({ error: 'Routine and optimization request are required' }, { status: 400 });
        }

        const optimization = await workoutAI.optimizeWorkoutRoutine(routine, userHistory, optimizationRequest);

        return json({
            success: true,
            optimization
        });
    } catch (error) {
        console.error('AI Workout Optimization Error:', error);
        return json({
            error: 'Failed to optimize workout',
            details: error.message
        }, { status: 500 });
    }
}
