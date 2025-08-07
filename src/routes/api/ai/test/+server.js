import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function GET() {
    try {
        if (!OPENAI_API_KEY) {
            return json({ error: 'API key not configured' }, { status: 500 });
        }

        // Test the API key by making a simple request
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return json({
                success: true,
                message: 'API key is valid',
                availableModels: data.data.length,
                apiKeyPrefix: OPENAI_API_KEY.substring(0, 7) + '...'
            });
        } else {
            return json({
                error: `API key test failed: ${response.status} ${response.statusText}`,
                status: response.status
            }, { status: 400 });
        }
    } catch (error) {
        return json({
            error: 'Failed to test API key',
            details: error.message
        }, { status: 500 });
    }
}
