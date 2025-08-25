import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { requireGuest } from '$lib/server/auth-utils';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load = async (event) => {
    // Redirect if already logged in
    requireGuest(event.locals.user);
    return {};
};

export const actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, {
                message: 'Invalid username (min 3, max 100 characters, alphanumeric, @, dots, hyphens, underscores)'
            });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
        }

        try {
            const results = await db.select().from(table.user).where(eq(table.user.username, username));

            const existingUser = results.at(0);
            if (!existingUser) {
                return fail(400, { message: 'Incorrect username or password' });
            }

            const validPassword = await verify(existingUser.passwordHash, password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });
            if (!validPassword) {
                return fail(400, { message: 'Incorrect username or password' });
            }

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(sessionToken, existingUser.id);
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

            return redirect(302, '/');
        } catch (error) {
            console.error('Login error:', error);
            return fail(500, { message: 'An error occurred during login. Please try again.' });
        }
    },

    register: async (event) => {
        console.log('=== REGISTRATION ATTEMPT ===');
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        console.log('Received username:', username);
        console.log('Received password length:', password?.length);
        console.log('Username type:', typeof username);
        console.log('Password type:', typeof password);

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username (min 3, max 100 characters, alphanumeric, @, dots, hyphens, underscores)' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
        }

        try {
            // Check if username already exists
            const existingUser = await db.select().from(table.user).where(eq(table.user.username, username));
            if (existingUser.length > 0) {
                return fail(400, { message: 'Username already exists. Please choose a different one.' });
            }

            const userId = generateUserId();
            const passwordHash = await hash(password, {
                // recommended minimum parameters
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });

            await db.insert(table.user).values({ id: userId, username, passwordHash });

            // Create default user settings
            await db.insert(table.userSettings).values({
                userId: userId,
                weightUnit: 'lbs',
                restBetweenSets: 60,
                autoIncreaseWeight: true,
                autoDecreaseWeight: true,
                weightIncreaseAmount: 5,
                soundEnabled: true
            });

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(sessionToken, userId);
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

            return redirect(302, '/');
        } catch (error) {
            console.error('Registration error:', error);
            return fail(500, { message: 'An error occurred during registration. Please try again.' });
        }
    }
};

function generateUserId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}

function validateUsername(username) {
    console.log('=== VALIDATING USERNAME ===');
    console.log('Username to validate:', username);
    console.log('Type check:', typeof username === 'string');
    console.log('Length check:', username?.length >= 3 && username?.length <= 100);
    console.log('Length value:', username?.length);
    console.log('Pattern test:', /^[a-zA-Z0-9@._-]+$/.test(username));

    const isValid = (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 100 &&
        /^[a-zA-Z0-9@._-]+$/.test(username)
    );

    console.log('Final validation result:', isValid);
    return isValid;
}

function validatePassword(password) {
    console.log('=== VALIDATING PASSWORD ===');
    console.log('Password to validate:', password ? '[REDACTED]' : 'null/undefined');
    console.log('Type check:', typeof password === 'string');
    console.log('Length check:', password?.length >= 6 && password?.length <= 255);
    console.log('Length value:', password?.length);

    const isValid = typeof password === 'string' && password.length >= 6 && password.length <= 255;
    console.log('Final validation result:', isValid);
    return isValid;
}
