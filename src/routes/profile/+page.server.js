import { requireAuth } from '$lib/server/auth-utils';

export const load = async ({ locals }) => {
    // Require user to be logged in
    const user = requireAuth(locals.user);
    return { user };
};
