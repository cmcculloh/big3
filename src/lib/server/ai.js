import { OPENAI_API_KEY } from '$env/static/private';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// AI workout assistant class
class WorkoutAI {
    constructor() {
        this.apiKey = OPENAI_API_KEY;
        this.model = 'gpt-3.5-turbo';

        // Check if API key is loaded
        if (!this.apiKey) {
            console.error('OpenAI API key is not loaded!');
            throw new Error('OpenAI API key is not configured');
        }
    }

    async generateResponse(messages) {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    max_tokens: 2000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again in a few minutes.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenAI API key.');
                } else if (response.status === 402) {
                    throw new Error('Quota exceeded. Please check your OpenAI billing and plan limits.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. Please check your OpenAI account status and billing.');
                } else if (response.status === 404) {
                    throw new Error('Model not found. Please check the model name.');
                } else if (response.status === 500) {
                    throw new Error('OpenAI server error. Please try again later.');
                } else {
                    // Get the actual error message from OpenAI if possible
                    try {
                        const errorData = await response.json();
                        const errorMessage = errorData.error?.message || errorData.error?.type || 'Unknown error';
                        throw new Error(`OpenAI API error: ${errorMessage}`);
                    } catch {
                        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
                    }
                }
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI API Error:', error);
            console.error('Error details:', error.message);
            throw error; // Re-throw the original error instead of wrapping it
        }
    }

    // Generate a complete workout routine
    async generateWorkoutRoutine(request, userHistory = null) {
        const systemPrompt = `You are an expert fitness trainer and workout planner. Create detailed, safe, and effective workout routines.

Key Guidelines:
- Always include proper warm-up exercises (5-10 minutes)
- Always include cool-down stretches (5-10 minutes)
- Provide specific sets, reps, and rest periods
- Consider user's available time and equipment
- Suggest appropriate weights based on fitness level
- Include exercise descriptions and form tips
- Ensure balanced muscle group targeting

Format your response as JSON with this structure:
{
  "name": "Workout Name",
  "description": "Brief description",
  "estimatedDuration": 45,
  "category": "strength|cardio|full_body|flexibility",
  "exercises": [
    {
      "name": "Exercise Name",
      "description": "How to perform",
      "category": "warmup|main|cooldown",
      "sets": 3,
      "reps": 10,
      "duration": null,
      "restBetweenSets": 60,
      "equipment": "bodyweight|weights|bands",
      "weight": null,
      "bandStrength": null,
      "notes": "Form tips or modifications"
    }
  ],
  "aiNotes": "Additional recommendations from AI"
}`;

        const userPrompt = `Create a workout routine based on this request: "${request}"

${userHistory ? `User's recent workout history: ${JSON.stringify(userHistory)}` : ''}

Please create a complete workout that fits the user's needs and preferences.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        const response = await this.generateResponse(messages);

        try {
            // Try to parse as JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON found in response');
        } catch (parseError) {
            // If JSON parsing fails, return a structured response
            return {
                name: 'AI Generated Workout',
                description: response,
                estimatedDuration: 45,
                category: 'full_body',
                exercises: [],
                aiNotes: 'AI generated this workout based on your request. Please review and adjust as needed.',
                rawResponse: response
            };
        }
    }

    generateFallbackWorkout(request) {
        const lowerRequest = request.toLowerCase();

        // Determine workout type based on request
        let workoutType = 'full_body';
        let duration = 30;
        let equipment = 'bodyweight';

        if (lowerRequest.includes('upper') || lowerRequest.includes('arms') || lowerRequest.includes('chest')) {
            workoutType = 'upper_body';
        } else if (lowerRequest.includes('lower') || lowerRequest.includes('legs')) {
            workoutType = 'lower_body';
        } else if (lowerRequest.includes('core') || lowerRequest.includes('abs')) {
            workoutType = 'core';
        } else if (lowerRequest.includes('cardio')) {
            workoutType = 'cardio';
        }

        // Extract time
        const timeMatch = request.match(/(\d+)\s*(?:min|minutes?|mins?)/i);
        if (timeMatch) {
            duration = parseInt(timeMatch[1]);
        }

        // Extract equipment
        if (lowerRequest.includes('dumbbell')) {
            equipment = 'dumbbells';
        } else if (lowerRequest.includes('band')) {
            equipment = 'resistance_bands';
        }

        const workouts = {
            upper_body: {
                name: 'Upper Body Strength',
                description: 'Comprehensive upper body workout targeting chest, back, shoulders, and arms',
                estimatedDuration: duration,
                category: 'strength',
                exercises: [
                    {
                        name: 'Push-ups',
                        description: 'Start in plank position, lower body until chest nearly touches ground, push back up',
                        category: 'warmup',
                        sets: 2,
                        reps: 5,
                        duration: null,
                        restBetweenSets: 30,
                        equipment: 'bodyweight',
                        weight: null,
                        bandStrength: null,
                        notes: 'Modify by doing knee push-ups if needed'
                    },
                    {
                        name: 'Dumbbell Rows',
                        description: 'Bend forward, pull dumbbell to chest while keeping back straight',
                        category: 'main',
                        sets: 3,
                        reps: 12,
                        duration: null,
                        restBetweenSets: 60,
                        equipment: equipment,
                        weight: equipment === 'dumbbells' ? 15 : null,
                        bandStrength: null,
                        notes: 'Focus on squeezing shoulder blades together'
                    },
                    {
                        name: 'Shoulder Press',
                        description: 'Press dumbbells overhead while keeping core engaged',
                        category: 'main',
                        sets: 3,
                        reps: 10,
                        duration: null,
                        restBetweenSets: 60,
                        equipment: equipment,
                        weight: equipment === 'dumbbells' ? 12 : null,
                        bandStrength: null,
                        notes: 'Keep back straight, don\'t arch'
                    },
                    {
                        name: 'Tricep Dips',
                        description: 'Use chair or bench, lower body by bending elbows, push back up',
                        category: 'main',
                        sets: 3,
                        reps: 10,
                        duration: null,
                        restBetweenSets: 60,
                        equipment: 'bodyweight',
                        weight: null,
                        bandStrength: null,
                        notes: 'Keep elbows close to body'
                    },
                    {
                        name: 'Arm Circles',
                        description: 'Stand with arms out, make small circles forward and backward',
                        category: 'cooldown',
                        sets: 1,
                        reps: null,
                        duration: 60,
                        restBetweenSets: 0,
                        equipment: 'bodyweight',
                        weight: null,
                        bandStrength: null,
                        notes: 'Gentle stretching for shoulders'
                    }
                ],
                aiNotes: 'This is a fallback workout while AI is unavailable. It targets all major upper body muscle groups with proper warm-up and cool-down.'
            }
        };

        return workouts[workoutType] || workouts.upper_body;
    }

    // Optimize existing workout routine
    async optimizeWorkoutRoutine(routine, userHistory, optimizationRequest) {
        const systemPrompt = `You are an expert fitness trainer. Analyze and optimize workout routines based on user feedback and performance history.

Provide specific recommendations for:
- Exercise substitutions
- Set/rep adjustments
- Weight modifications
- Rest period optimization
- Exercise order improvements
- Warm-up and cool-down additions

Format your response as JSON with this structure:
{
  "optimizations": [
    {
      "type": "substitution|adjustment|addition|removal",
      "exerciseName": "Current exercise name",
      "suggestion": "Specific recommendation",
      "reason": "Why this change is beneficial"
    }
  ],
  "newRoutine": {
    "name": "Optimized Workout Name",
    "description": "Updated description",
    "estimatedDuration": 45,
    "exercises": [...]
  },
  "aiNotes": "Summary of changes and reasoning"
}`;

        const userPrompt = `Optimize this workout routine: ${JSON.stringify(routine)}

User's request: "${optimizationRequest}"

User's workout history: ${JSON.stringify(userHistory)}

Please provide specific, actionable recommendations.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        const response = await this.generateResponse(messages);

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON found in response');
        } catch (parseError) {
            return {
                optimizations: [],
                newRoutine: routine,
                aiNotes: response,
                rawResponse: response
            };
        }
    }

    // Generate on-the-fly workout
    async generateQuickWorkout(timeAvailable, focus, userHistory) {
        const request = `I have ${timeAvailable} minutes today and want to focus on ${focus}. Build a complete workout for me with proper warm-up and cool-down included.`;

        return await this.generateWorkoutRoutine(request, userHistory);
    }

    // Suggest exercise replacements
    async suggestReplacements(exercise, reason, userHistory) {
        const systemPrompt = `You are an expert fitness trainer. Suggest alternative exercises that target the same muscle groups and provide similar benefits.

Consider:
- User's available equipment
- Exercise difficulty level
- Muscle group targeting
- Injury prevention
- Variety and progression

Format response as JSON:
{
  "originalExercise": "Exercise name",
  "replacements": [
    {
      "name": "Alternative exercise name",
      "description": "How to perform",
      "equipment": "required equipment",
      "difficulty": "beginner|intermediate|advanced",
      "reason": "Why this is a good replacement"
    }
  ]
}`;

        const userPrompt = `Suggest replacements for: ${exercise.name}

Reason for replacement: ${reason}

User's equipment and history: ${JSON.stringify(userHistory)}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        const response = await this.generateResponse(messages);

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON found in response');
        } catch (parseError) {
            return {
                originalExercise: exercise.name,
                replacements: [],
                aiNotes: response
            };
        }
    }

    // Analyze workout performance and suggest improvements
    async analyzePerformance(workoutSession, userHistory) {
        const systemPrompt = `You are an expert fitness trainer analyzing workout performance data. Provide insights and recommendations for improvement.

Analyze:
- Performance trends
- Weight progression
- Exercise difficulty ratings
- Rest periods
- Overall workout effectiveness

Format response as JSON:
{
  "insights": [
    {
      "type": "trend|recommendation|warning",
      "title": "Insight title",
      "description": "Detailed explanation",
      "action": "Recommended action"
    }
  ],
  "recommendations": [
    {
      "category": "weight|reps|rest|form",
      "suggestion": "Specific recommendation",
      "reason": "Why this helps"
    }
  ]
}`;

        const userPrompt = `Analyze this workout session: ${JSON.stringify(workoutSession)}

User's recent history: ${JSON.stringify(userHistory)}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        const response = await this.generateResponse(messages);

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON found in response');
        } catch (parseError) {
            return {
                insights: [],
                recommendations: [],
                aiNotes: response
            };
        }
    }

    // Generate exercise using AI
    async generateExerciseWithAI(prompt) {
        const systemPrompt = `You are an expert fitness trainer and exercise specialist. Create detailed, safe, and effective exercises based on user requests.

Key Guidelines:
- Always prioritize safety and proper form
- Provide clear, step-by-step instructions
- Consider available equipment and user fitness level
- Include target muscle groups and benefits
- Add safety tips and modifications when appropriate

Format your response as JSON with this structure:
{
  "name": "Exercise Name",
  "description": "Brief description of the exercise",
  "category": "strength|cardio|flexibility|balance|sports",
  "equipment": "bodyweight|dumbbells|resistance_bands|barbell|kettlebell|cardio_machine",
  "instructions": "Step-by-step instructions for proper form",
  "safetyTips": "Important safety considerations",
  "targetMuscles": "Primary and secondary muscle groups targeted"
}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
        ];

        try {
            const response = await this.generateResponse(messages);

            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return jsonMatch[0];
            }

            // If no JSON found, return the raw response
            return response;
        } catch (error) {
            console.error('Error generating exercise with AI:', error);
            throw error;
        }
    }

    // Check OpenAI account status and quota
    async checkAccountStatus() {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (response.status === 401) {
                return { status: 'invalid_key', message: 'Invalid API key' };
            } else if (response.status === 402) {
                return { status: 'quota_exceeded', message: 'Quota exceeded - check billing' };
            } else if (response.status === 403) {
                return { status: 'access_denied', message: 'Access denied - check account status' };
            } else if (response.ok) {
                return { status: 'active', message: 'API key is valid and active' };
            } else {
                return { status: 'error', message: `HTTP ${response.status}: ${response.statusText}` };
            }
        } catch (error) {
            return { status: 'network_error', message: error.message };
        }
    }
}

// Export singleton instance
export const workoutAI = new WorkoutAI();

// Export standalone functions for convenience
export const generateExerciseWithAI = (prompt) => workoutAI.generateExerciseWithAI(prompt);
