import { json } from '@sveltejs/kit';
import { generateExerciseWithAI } from '$lib/server/ai.js';

// POST /api/exercises/generate - Generate exercise using AI
export async function POST({ request }) {
    try {
        const { description, equipment, targetMuscles, difficulty } = await request.json();

        if (!description) {
            return json({ error: 'Exercise description is required' }, { status: 400 });
        }

        const prompt = `Create a detailed exercise based on this description: "${description}"${
            equipment ? ` Equipment available: ${equipment}` : ''
        }${
            targetMuscles ? ` Target muscles: ${targetMuscles}` : ''
        }${
            difficulty ? ` Difficulty level: ${difficulty}` : ''
        }

        Please provide:
        - Exercise name
        - Description
        - Category (strength, cardio, flexibility, etc.)
        - Equipment needed
        - Step-by-step instructions
        - Safety tips
        - Target muscle groups

        Format as JSON with these fields: name, description, category, equipment, instructions, safetyTips, targetMuscles`;

        const aiResponse = await generateExerciseWithAI(prompt);

        if (!aiResponse) {
            return json({ error: 'Failed to generate exercise with AI' }, { status: 500 });
        }

        // Try to parse the AI response as JSON
        let exerciseData;
        try {
            exerciseData = JSON.parse(aiResponse);
        } catch (parseError) {
            // If parsing fails, try to extract structured data from the response
            exerciseData = {
                name: 'AI Generated Exercise',
                description: aiResponse,
                category: 'strength',
                equipment: equipment || 'bodyweight',
                instructions: aiResponse,
                safetyTips: 'Please consult with a fitness professional before attempting new exercises.',
                targetMuscles: targetMuscles || 'various'
            };
        }

        return json(exerciseData);
    } catch (error) {
        console.error('Error generating exercise:', error);
        return json({ error: 'Failed to generate exercise' }, { status: 500 });
    }
}
