import { json } from '@sveltejs/kit';
import { workoutAI } from '$lib/server/ai.js';
import { geminiWorkoutAI } from '$lib/server/gemini-ai.js';

export async function POST({ request }) {
    try {
        const { request: workoutRequest, userHistory } = await request.json();

        if (!workoutRequest) {
            return json({ error: 'Workout request is required' }, { status: 400 });
        }

        let aiWorkout;
        let aiError = null;
        let aiProvider = 'gemini';

        try {
            // Try Gemini first (free tier)
            console.log('Attempting to generate workout with Gemini...');
            aiWorkout = await geminiWorkoutAI.generateWorkoutRoutine(workoutRequest, userHistory);
        } catch (geminiError) {
            console.log('Gemini failed, trying OpenAI as fallback:', geminiError.message);
            aiProvider = 'openai';

            try {
                // Try OpenAI as fallback
                aiWorkout = await workoutAI.generateWorkoutRoutine(workoutRequest, userHistory);
            } catch (openaiError) {
                console.log('OpenAI also failed, using fallback workout:', openaiError.message);
                aiError = openaiError;

                // Check if it's a quota/billing issue vs other errors
                if (openaiError.message.includes('quota') || openaiError.message.includes('billing') || openaiError.message.includes('insufficient_quota')) {
                    console.warn('OpenAI quota exceeded - user needs to check billing');
                }

                // Use fallback if both AIs fail
                aiWorkout = geminiWorkoutAI.generateFallbackWorkout(workoutRequest);
            }
        }

        return json({
            success: true,
            workout: aiWorkout,
            aiError: aiError ? aiError.message : null,
            usedFallback: !!aiError,
            aiProvider: aiProvider
        });
    } catch (error) {
        console.error('AI Workout Generation Error:', error);
        return json({
            error: 'Failed to generate workout',
            details: error.message
        }, { status: 500 });
    }
}
