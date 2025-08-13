import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function POST() {
    try {
        // Check if demo user already exists
        const existingUser = await db.select().from(user).where(eq(user.id, 'demo-user')).limit(1);

        if (existingUser.length > 0) {
            return json({
                success: true,
                message: 'Demo user already exists',
                userId: 'demo-user'
            });
        }

        // Create demo user
        const [demoUser] = await db.insert(user).values({
            id: 'demo-user',
            username: 'demo-user',
            passwordHash: 'demo-hash', // This is just for demo purposes
            age: 25
        }).returning();

        return json({
            success: true,
            message: 'Demo user created successfully',
            userId: demoUser.id
        });

    } catch (error) {
        console.error('Demo User Creation Error:', error);
        return json({
            error: 'Failed to create demo user',
            details: error.message
        }, { status: 500 });
    }
}
