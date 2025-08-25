import { fail, redirect } from '@sveltejs/kit';
import { requireGuest } from '$lib/server/auth-utils';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

export const load = async (event) => {
    // Redirect if already logged in
    requireGuest(event.locals.user);

    const token = event.url.searchParams.get('token');
    if (!token) {
        redirect(302, '/forgot-password');
    }

    return {};
};

export const actions = {
    resetPassword: async (event) => {
        const formData = await event.request.formData();
        const token = formData.get('token');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!token) {
            return fail(400, { message: 'Invalid reset token' });
        }

        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
        }

        if (password !== confirmPassword) {
            return fail(400, { message: 'Passwords do not match' });
        }

        try {
            // Find user with valid reset token
            const now = new Date();
            const results = await db
                .select()
                .from(table.user)
                .where(
                    and(
                        eq(table.user.resetToken, token),
                        gt(table.user.resetTokenExpires, now)
                    )
                );

            const user = results.at(0);
            if (!user) {
                return fail(400, { message: 'Invalid or expired reset token. Please request a new one.' });
            }

            // Hash new password
            const passwordHash = await hash(password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });

            // Update user password and clear reset token
            await db
                .update(table.user)
                .set({
                    passwordHash: passwordHash,
                    resetToken: null,
                    resetTokenExpires: null
                })
                .where(eq(table.user.id, user.id));

            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return fail(500, { message: 'An error occurred while resetting your password. Please try again.' });
        }
    }
};

function validatePassword(password) {
    return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
