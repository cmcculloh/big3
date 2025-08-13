import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { exercise, equipment } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

// GET /api/exercises - Get all exercises
export async function GET() {
    try {
        const exercises = await db
            .select({
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                category: exercise.category,
                equipmentId: exercise.equipmentId,
                instructions: exercise.instructions,
                videoUrl: exercise.videoUrl,
                createdAt: exercise.createdAt
            })
            .from(exercise)
            .orderBy(desc(exercise.createdAt));

        // Get equipment details for each exercise
        const exercisesWithEquipment = await Promise.all(
            exercises.map(async (ex) => {
                if (ex.equipmentId) {
                    const [equipmentData] = await db
                        .select()
                        .from(equipment)
                        .where(eq(equipment.id, ex.equipmentId));

                    return {
                        ...ex,
                        equipment: equipmentData ? {
                            id: equipmentData.id,
                            name: equipmentData.name,
                            type: equipmentData.type
                        } : null
                    };
                }
                return {
                    ...ex,
                    equipment: null
                };
            })
        );

        return json(exercisesWithEquipment);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }
}

// POST /api/exercises - Create a new exercise
export async function POST({ request }) {
    try {
        const { name, description, category, equipmentId, instructions, videoUrl } = await request.json();

        if (!name || !category) {
            return json({ error: 'Name and category are required' }, { status: 400 });
        }

        const [newExercise] = await db.insert(exercise).values({
            name: name.trim(),
            description: description?.trim() || null,
            category,
            equipmentId: equipmentId || null,
            instructions: instructions?.trim() || null,
            videoUrl: videoUrl?.trim() || null
        }).returning();

        return json(newExercise, { status: 201 });
    } catch (error) {
        console.error('Error creating exercise:', error);
        return json({ error: 'Failed to create exercise' }, { status: 500 });
    }
}
