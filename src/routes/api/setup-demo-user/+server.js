import { json } from '@sveltejs/kit';
import { hash } from '@node-rs/argon2';
import { db } from '$lib/server/db/index.js';
import { user, userSettings } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function POST() {
    try {
        // Check if demo user already exists
        const existingUser = await db.select().from(user).where(eq(user.username, 'demo')).limit(1);

        if (existingUser.length > 0) {
            return json({
                success: true,
                message: 'Demo user already exists',
                username: 'demo',
                password: 'demo123'
            });
        }

        // Create demo user with proper password hash
        const passwordHash = await hash('demo123', {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const [demoUser] = await db.insert(user).values({
            username: 'demo',
            passwordHash: passwordHash,
            age: 25
        }).returning();

        // Create default user settings
        await db.insert(userSettings).values({
            userId: demoUser.id,
            weightUnit: 'lbs',
            restBetweenSets: 60,
            autoIncreaseWeight: true,
            autoDecreaseWeight: true,
            weightIncreaseAmount: 5,
            soundEnabled: true
        });

        return json({
            success: true,
            message: 'Demo user created successfully',
            username: 'demo',
            password: 'demo123'
        });

    } catch (error) {
        console.error('Demo User Creation Error:', error);
        return json({
            error: 'Failed to create demo user',
            details: error.message
        }, { status: 500 });
    }
}
