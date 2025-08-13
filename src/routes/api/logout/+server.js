import { json } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export async function POST({ locals, cookies }) {
    try {
        if (locals.session) {
            await auth.invalidateSession(locals.session.id);
            auth.deleteSessionTokenCookie({ cookies });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return json({ error: 'Failed to logout' }, { status: 500 });
    }
}
