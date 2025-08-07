import { json } from '@sveltejs/kit';
import { workoutAI } from '$lib/server/ai.js';

export async function POST({ request }) {
    try {
        const { timeAvailable, focus, userHistory } = await request.json();

        if (!timeAvailable || !focus) {
            return json({ error: 'Time available and focus area are required' }, { status: 400 });
        }

        const quickWorkout = await workoutAI.generateQuickWorkout(timeAvailable, focus, userHistory);

        return json({
            success: true,
            workout: quickWorkout
        });
    } catch (error) {
        console.error('AI Quick Workout Error:', error);
        return json({
            error: 'Failed to generate quick workout',
            details: error.message
        }, { status: 500 });
    }
}
