import { json } from '@sveltejs/kit';
import { workoutAI } from '$lib/server/ai.js';

export async function GET() {
    try {
        const status = await workoutAI.checkAccountStatus();
        return json({
            success: true,
            status: status.status,
            message: status.message,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Status check error:', error);
        return json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
