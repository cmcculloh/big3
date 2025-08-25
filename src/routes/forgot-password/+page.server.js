import { fail } from '@sveltejs/kit';
import { requireGuest } from '$lib/server/auth-utils';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load = async (event) => {
    // Debug: Check if environment variables are loaded
    console.log('Environment check - DATABASE_URL exists:', !!process.env.DATABASE_URL);

    // Redirect if already logged in
    requireGuest(event.locals.user);
    return {};
};

export const actions = {
    requestReset: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        console.log('Received username for password reset:', username);
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        if (!validateUsername(username)) {
            console.log('Username validation failed for:', username);
            return fail(400, {
                message: 'Invalid username format'
            });
        }

        try {
            // Check if user exists
            console.log('Searching for user with username:', username);
            const results = await db.select().from(table.user).where(eq(table.user.username, username));
            console.log('Database results:', results);
            const existingUser = results.at(0);

            if (existingUser) {
                // Generate reset token
                const resetToken = generateResetToken();
                const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

                // Update user with reset token
                await db
                    .update(table.user)
                    .set({
                        resetToken: resetToken,
                        resetTokenExpires: resetTokenExpires
                    })
                    .where(eq(table.user.id, existingUser.id));

                // In a real application, you would send an email here
                // For now, we'll just log the token for development purposes
                console.log(`Password reset token for ${username}: ${resetToken}`);
                console.log(`Reset link: ${event.url.origin}/reset-password?token=${resetToken}`);
                console.log(`Note: If using a different port, update the URL accordingly`);
            }

            // Always return success to prevent username enumeration
            return { success: true };
        } catch (error) {
            console.error('Password reset request error:', error);
            return fail(500, { message: 'An error occurred. Please try again.' });
        }
    }
};

function validateUsername(username) {
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 100 && // Allow longer for email-like usernames
        /^[a-zA-Z0-9@._-]+$/.test(username) // Allow @ and . for email-like usernames
    );
}

function generateResetToken() {
    // Generate a secure random token
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    return encodeBase32LowerCase(bytes);
}
