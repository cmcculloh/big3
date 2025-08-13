import { json } from '@sveltejs/kit';
import { geminiWorkoutAI } from '$lib/server/gemini-ai.js';

export async function POST({ request }) {
    try {
        const { input, type, currentPrompt, userHistory } = await request.json();

        // Create a context-aware prompt for Gemini
        let systemPrompt = `You are an AI workout assistant helping users build workout prompts.

Current context:
- User is typing: "${input}"
- Building prompt type: ${type}
- Current prompt so far: "${currentPrompt}"
- User has workout history: ${userHistory ? 'Yes' : 'No'}

Your task is to provide 4-6 relevant suggestions for the next step in building their workout prompt.`;

        let userPrompt = '';

        switch (type) {
            case 'overallTask':
                userPrompt = `The user is starting to build a workout prompt. Based on what they're typing ("${input}"), suggest 4-6 different workout goals or tasks they might want to accomplish.

Examples of what to suggest:
- Create a new workout routine
- Optimize my existing routine
- Generate a quick workout
- Suggest exercise substitutions
- Analyze my performance
- Create a meal plan
- Design a training program

Return only the suggestions as a JSON array with this format:
[{"text": "suggestion text", "action": "replace"}]`;
                break;

            case 'duration':
                userPrompt = `The user wants to specify workout duration. Based on their input ("${input}"), suggest 4-6 time options that would make sense for their workout.

Consider:
- Common workout durations (15, 20, 30, 45, 60 minutes)
- What they've already specified in their prompt
- Typical workout lengths for their goals

Return only the suggestions as a JSON array with this format:
[{"text": "30 minutes", "action": "append"}]`;
                break;

            case 'targetAreas':
                userPrompt = `The user wants to specify target areas for their workout. Based on their input ("${input}"), suggest 4-6 body areas or muscle groups they might want to focus on.

Consider:
- Common target areas (upper body, lower body, core, full body, arms, legs, back, chest)
- What would complement their current prompt
- Balanced workout options

Return only the suggestions as a JSON array with this format:
[{"text": "upper body", "action": "append"}]`;
                break;

            case 'workoutType':
                userPrompt = `The user wants to specify the type of workout. Based on their input ("${input}"), suggest 4-6 workout styles or training methods.

Consider:
- Common workout types (strength training, cardio, yoga, pilates, HIIT, circuit training, flexibility, endurance)
- What would work well with their target areas and duration
- Popular and effective training methods

Return only the suggestions as a JSON array with this format:
[{"text": "strength training", "action": "append"}]`;
                break;

            case 'equipmentType':
                userPrompt = `The user wants to specify what equipment they have available. Based on their input ("${input}"), suggest 4-6 equipment options.

Consider:
- Common equipment types (bodyweight only, dumbbells, barbell, resistance bands, gym equipment, minimal equipment)
- What would work with their workout type and target areas
- Accessibility and availability

Return only the suggestions as a JSON array with this format:
[{"text": "dumbbells", "action": "append"}]`;
                break;

            case 'include':
                userPrompt = `The user wants to specify what elements to include in their workout. Based on their input ("${input}"), suggest 4-6 workout components.

Consider:
- Essential workout elements (warmup exercises, main exercises, cool-down stretches, cardio elements, strength training, flexibility work)
- What would complete their workout based on their other selections
- Balanced workout structure

Return only the suggestions as a JSON array with this format:
[{"text": "warmup exercises", "action": "append"}]`;
                break;

            default:
                userPrompt = `The user seems to have completed their prompt. Suggest 4-6 ways they could refine or enhance their current workout request.

Current prompt: "${currentPrompt}"

Consider:
- Adding more specific details
- Including additional preferences
- Refining their goals
- Adding constraints or limitations

Return only the suggestions as a JSON array with this format:
[{"text": "suggestion text", "action": "append"}]`;
        }

        // Get AI-generated suggestions
        const aiResponse = await geminiWorkoutAI.generateResponse(`${systemPrompt}\n\n${userPrompt}`);

        // Try to parse the AI response as JSON
        let suggestions = [];
        try {
            // Extract JSON from the response (AI might include extra text)
            const jsonMatch = aiResponse.match(/\[.*\]/s);
            if (jsonMatch) {
                suggestions = JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.warn('Failed to parse AI response as JSON:', parseError);
        }

        // Fallback to static suggestions if AI parsing fails
        if (!suggestions || suggestions.length === 0) {
            suggestions = getFallbackSuggestions(type);
        }

        // Ensure suggestions have the correct format
        suggestions = suggestions.map(suggestion => ({
            text: suggestion.text || suggestion,
            action: suggestion.action || 'append'
        }));

        return json({
            success: true,
            suggestions: suggestions.slice(0, 6) // Limit to 6 suggestions
        });

    } catch (error) {
        console.error('Auto-complete API Error:', error);

        // Return fallback suggestions on error
        const fallbackSuggestions = getFallbackSuggestions(type || 'overallTask');

        return json({
            success: false,
            error: error.message,
            suggestions: fallbackSuggestions
        });
    }
}

function getFallbackSuggestions(type) {
    switch (type) {
        case 'overallTask':
            return [
                { text: 'Create a new workout routine', action: 'replace' },
                { text: 'Optimize my existing routine', action: 'replace' },
                { text: 'Generate a quick workout', action: 'replace' },
                { text: 'Suggest exercise substitutions', action: 'replace' }
            ];
        case 'duration':
            return [
                { text: '30 minutes', action: 'append' },
                { text: '45 minutes', action: 'append' },
                { text: '1 hour', action: 'append' },
                { text: '20 minutes', action: 'append' }
            ];
        case 'targetAreas':
            return [
                { text: 'upper body', action: 'append' },
                { text: 'lower body', action: 'append' },
                { text: 'full body', action: 'append' },
                { text: 'core', action: 'append' }
            ];
        case 'workoutType':
            return [
                { text: 'strength training', action: 'append' },
                { text: 'cardio', action: 'append' },
                { text: 'yoga', action: 'append' },
                { text: 'HIIT', action: 'append' }
            ];
        case 'equipmentType':
            return [
                { text: 'dumbbells', action: 'append' },
                { text: 'bodyweight only', action: 'append' },
                { text: 'resistance bands', action: 'append' },
                { text: 'full gym equipment', action: 'append' }
            ];
        case 'include':
            return [
                { text: 'warmup exercises', action: 'append' },
                { text: 'cool-down stretches', action: 'append' },
                { text: 'cardio elements', action: 'append' },
                { text: 'strength training', action: 'append' }
            ];
        default:
            return [
                { text: 'Add more specific details', action: 'append' },
                { text: 'Include equipment preferences', action: 'append' },
                { text: 'Specify difficulty level', action: 'append' },
                { text: 'Add time constraints', action: 'append' }
            ];
    }
}
