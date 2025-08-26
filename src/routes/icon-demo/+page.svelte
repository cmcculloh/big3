<script>
    import ExerciseIcon from '$lib/components/ExerciseIcon.svelte';
    import Card from '$lib/components/Card.svelte';
    import Nav from '$lib/components/nav.svelte';

    // All available exercise categories and their icons
    const exerciseCategories = [
        { category: 'strength', name: 'Strength Training', description: 'Weight lifting and resistance training' },
        { category: 'chest', name: 'Chest', description: 'Pectoral muscle exercises' },
        { category: 'back', name: 'Back', description: 'Back and lat exercises' },
        { category: 'shoulders', name: 'Shoulders', description: 'Deltoid exercises' },
        { category: 'biceps', name: 'Biceps', description: 'Bicep muscle exercises' },
        { category: 'triceps', name: 'Triceps', description: 'Tricep muscle exercises' },
        { category: 'legs', name: 'Legs', description: 'Lower body exercises' },
        { category: 'core', name: 'Core', description: 'Abdominal and core exercises' },
        { category: 'cardio', name: 'Cardio', description: 'Cardiovascular exercises' },
        { category: 'running', name: 'Running', description: 'Running and jogging' },
        { category: 'cycling', name: 'Cycling', description: 'Bicycle exercises' },
        { category: 'swimming', name: 'Swimming', description: 'Swimming exercises' },
        { category: 'rowing', name: 'Rowing', description: 'Rowing machine exercises' },
        { category: 'flexibility', name: 'Flexibility', description: 'Stretching exercises' },
        { category: 'yoga', name: 'Yoga', description: 'Yoga poses and flows' },
        { category: 'full_body', name: 'Full Body', description: 'Full body workouts' },
        { category: 'bodyweight', name: 'Bodyweight', description: 'Bodyweight exercises' },
        { category: 'functional', name: 'Functional', description: 'Functional movement exercises' },
        { category: 'rest', name: 'Rest', description: 'Rest and recovery periods' },
        { category: 'recovery', name: 'Recovery', description: 'Recovery exercises' },
        { category: 'barbell', name: 'Barbell', description: 'Barbell exercises' },
        { category: 'kettlebell', name: 'Kettlebell', description: 'Kettlebell exercises' },
        { category: 'resistance_band', name: 'Resistance Band', description: 'Resistance band exercises' },
        { category: 'machine', name: 'Machine', description: 'Machine-based exercises' },
        { category: 'cable', name: 'Cable', description: 'Cable machine exercises' },
        { category: 'push', name: 'Push', description: 'Pushing movement patterns' },
        { category: 'pull', name: 'Pull', description: 'Pulling movement patterns' },
        { category: 'squat', name: 'Squat', description: 'Squatting movements' },
        { category: 'lunge', name: 'Lunge', description: 'Lunging movements' },
        { category: 'hinge', name: 'Hinge', description: 'Hinging movements' },
        { category: 'rotation', name: 'Rotation', description: 'Rotational movements' },
        { category: 'arrow-up', name: 'Arrow Up', description: 'Upward movement' },
        { category: 'arrow-down', name: 'Arrow Down', description: 'Downward movement' },
        { category: 'default', name: 'Default', description: 'Default fallback icon' }
    ];

    // Specific exercise examples
    const exerciseExamples = [
        { name: 'Push-ups', category: 'push' },
        { name: 'Pull-ups', category: 'pull' },
        { name: 'Squats', category: 'squat' },
        { name: 'Deadlift', category: 'hinge' },
        { name: 'Bench Press', category: 'push' },
        { name: 'Barbell Row', category: 'pull' },
        { name: 'Lunges', category: 'lunge' },
        { name: 'Plank', category: 'core' },
        { name: 'Crunches', category: 'core' },
        { name: 'Burpees', category: 'cardio' },
        { name: 'Mountain Climbers', category: 'cardio' },
        { name: 'Jumping Jacks', category: 'cardio' },
        { name: 'High Knees', category: 'cardio' },
        { name: 'Butterfly Stretch', category: 'flexibility' },
        { name: 'Downward Dog', category: 'yoga' },
        { name: 'Warrior Pose', category: 'yoga' },
        { name: 'Tree Pose', category: 'yoga' },
        { name: 'Sun Salutation', category: 'yoga' },
        { name: 'Dumbbell Curls', category: 'biceps' },
        { name: 'Tricep Dips', category: 'triceps' },
        { name: 'Shoulder Press', category: 'shoulders' },
        { name: 'Chest Flyes', category: 'chest' },
        { name: 'Lat Pulldowns', category: 'back' },
        { name: 'Leg Press', category: 'legs' },
        { name: 'Kettlebell Swings', category: 'kettlebell' },
        { name: 'Resistance Band Rows', category: 'resistance_band' },
        { name: 'Cable Crossovers', category: 'cable' },
        { name: 'Elliptical', category: 'machine' },
        { name: 'Running', category: 'running' },
        { name: 'Cycling', category: 'cycling' },
        { name: 'Swimming', category: 'swimming' },
        { name: 'Rowing', category: 'rowing' }
    ];
</script>

<Nav />

<main class="icon-demo">
    <div class="demo-header">
        <h1>Exercise Icon Library Demo</h1>
        <p>Showcasing all available exercise-related icons from Lucide Icons</p>
    </div>

    <div class="demo-content">
        <!-- Category Icons -->
        <Card class="icon-section">
            <h2>Category-Based Icons</h2>
            <p>Icons based on exercise categories</p>
            <div class="icon-grid">
                {#each exerciseCategories as item}
                    <div class="icon-item">
                        <div class="icon-display">
                            <ExerciseIcon category={item.category} size={32} />
                        </div>
                        <div class="icon-info">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                            <code>category="{item.category}"</code>
                        </div>
                    </div>
                {/each}
            </div>
        </Card>

        <!-- Exercise Name Icons -->
        <Card class="icon-section">
            <h2>Exercise Name-Based Icons</h2>
            <p>Icons automatically selected based on exercise names</p>
            <div class="icon-grid">
                {#each exerciseExamples as exercise}
                    <div class="icon-item">
                        <div class="icon-display">
                            <ExerciseIcon exerciseName={exercise.name} size={32} />
                        </div>
                        <div class="icon-info">
                            <h4>{exercise.name}</h4>
                            <p>Category: {exercise.category}</p>
                            <code>exerciseName="{exercise.name}"</code>
                        </div>
                    </div>
                {/each}
            </div>
        </Card>

        <!-- Icon Sizes -->
        <Card class="icon-section">
            <h2>Icon Sizes</h2>
            <p>Available icon sizes for different use cases</p>
            <div class="size-demo">
                <div class="size-item">
                    <ExerciseIcon category="strength" size={16} />
                    <span>16px - Small buttons, inline text</span>
                </div>
                <div class="size-item">
                    <ExerciseIcon category="strength" size={20} />
                    <span>20px - Medium buttons, tips</span>
                </div>
                <div class="size-item">
                    <ExerciseIcon category="strength" size={24} />
                    <span>24px - Standard size, headings</span>
                </div>
                <div class="size-item">
                    <ExerciseIcon category="strength" size={32} />
                    <span>32px - Large displays, cards</span>
                </div>
                <div class="size-item">
                    <ExerciseIcon category="strength" size={48} />
                    <span>48px - Empty states, hero sections</span>
                </div>
            </div>
        </Card>

        <!-- Usage Examples -->
        <Card class="icon-section">
            <h2>Usage Examples</h2>
            <p>How to use the ExerciseIcon component in your code</p>
            <div class="code-examples">
                <div class="code-block">
                    <h4>Basic Usage</h4>
                    <pre><code>&lt;ExerciseIcon category="strength" size={24} /&gt;</code></pre>
                </div>
                <div class="code-block">
                    <h4>Exercise Name Based</h4>
                    <pre><code>&lt;ExerciseIcon exerciseName="Push-ups" size={20} /&gt;</code></pre>
                </div>
                <div class="code-block">
                    <h4>With Custom Classes</h4>
                    <pre><code>&lt;ExerciseIcon category="cardio" size={32} class_name="my-custom-class" /&gt;</code></pre>
                </div>
                <div class="code-block">
                    <h4>In Buttons</h4>
                    <pre><code>&lt;Button&gt;
  &lt;ExerciseIcon category="default" size={16} /&gt;
  Add Exercise
&lt;/Button&gt;</code></pre>
                </div>
            </div>
        </Card>
    </div>
</main>

<style>
    .icon-demo {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .demo-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .demo-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .demo-header p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .demo-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .icon-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .icon-section p {
        color: var(--tertiary);
        margin: 0 0 1.5rem 0;
    }

    .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }

    .icon-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
        border: 1px solid var(--subtle);
    }

    .icon-display {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: white;
        border-radius: 0.5rem;
        flex-shrink: 0;
    }

    .icon-info h4 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: var(--primary);
    }

    .icon-info p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0 0 0.5rem 0;
    }

    .icon-info code {
        font-size: 0.75rem;
        background-color: var(--subtle);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        color: var(--primary);
        font-family: monospace;
    }

    .size-demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .size-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .size-item span {
        font-size: 0.875rem;
        color: var(--tertiary);
    }

    .code-examples {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
    }

    .code-block h4 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .code-block pre {
        background-color: var(--subtle);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 0;
    }

    .code-block code {
        font-family: monospace;
        font-size: 0.875rem;
        color: var(--primary);
    }

    @media (max-width: 768px) {
        .icon-demo {
            padding: 1rem;
        }

        .demo-header h1 {
            font-size: 2rem;
        }

        .icon-grid {
            grid-template-columns: 1fr;
        }

        .code-examples {
            grid-template-columns: 1fr;
        }
    }
</style>
