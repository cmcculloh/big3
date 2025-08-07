import { json } from '@sveltejs/kit';
import { workoutAI } from '$lib/server/ai.js';

export async function POST({ request }) {
    try {
        const { request: workoutRequest, userHistory } = await request.json();

        if (!workoutRequest) {
            return json({ error: 'Workout request is required' }, { status: 400 });
        }

        let aiWorkout;

        try {
            // Try AI first
            aiWorkout = await workoutAI.generateWorkoutRoutine(workoutRequest, userHistory);
        } catch (aiError) {
            console.log('AI failed, using fallback workout:', aiError.message);
            // Use fallback if AI fails
            aiWorkout = workoutAI.generateFallbackWorkout(workoutRequest);
        }

        return json({
            success: true,
            workout: aiWorkout
        });
    } catch (error) {
        console.error('AI Workout Generation Error:', error);
        return json({
            error: 'Failed to generate workout',
            details: error.message
        }, { status: 500 });
    }
}
