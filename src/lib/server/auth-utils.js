import { redirect } from '@sveltejs/kit';

/**
 * Require user to be logged in for a route
 * @param {any} user - User object from locals
 * @param {string} redirectTo - Where to redirect if not logged in
 */
export function requireAuth(user, redirectTo = '/login') {
    if (!user) {
        throw redirect(302, redirectTo);
    }
    return user;
}

/**
 * Require user to NOT be logged in for a route (like login/register pages)
 * @param {any} user - User object from locals
 * @param {string} redirectTo - Where to redirect if already logged in
 */
export function requireGuest(user, redirectTo = '/') {
    if (user) {
        throw redirect(302, redirectTo);
    }
    return null;
}
