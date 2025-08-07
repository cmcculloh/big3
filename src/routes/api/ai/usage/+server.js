import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function GET() {
    try {
        if (!OPENAI_API_KEY) {
            return json({ error: 'API key not configured' }, { status: 500 });
        }

        // Check usage and billing
        const response = await fetch('https://api.openai.com/v1/dashboard/billing/usage', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return json({
                success: true,
                usage: data
            });
        } else {
            return json({
                error: `Failed to get usage: ${response.status} ${response.statusText}`,
                status: response.status
            }, { status: 400 });
        }
    } catch (error) {
        return json({
            error: 'Failed to check usage',
            details: error.message
        }, { status: 500 });
    }
}
