import { json } from '@sveltejs/kit';
import { geminiWorkoutAI } from '$lib/server/gemini-ai.js';

export async function GET() {
    try {
        const status = await geminiWorkoutAI.checkAccountStatus();
        return json({
            success: true,
            status: status.status,
            message: status.message,
            provider: 'gemini',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Gemini status check error:', error);
        return json({
            success: false,
            error: error.message,
            provider: 'gemini'
        }, { status: 500 });
    }
}
