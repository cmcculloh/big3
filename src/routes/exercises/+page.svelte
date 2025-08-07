<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let exercises = [];
    let filteredExercises = [];
    let loading = true;
    let searchQuery = '';
    let selectedCategory = 'all';
    let selectedEquipment = 'all';

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'strength', label: 'Strength' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'yoga', label: 'Yoga' },
        { value: 'sports', label: 'Sports' }
    ];

    const equipmentTypes = [
        { value: 'all', label: 'All Equipment' },
        { value: 'bodyweight', label: 'Bodyweight' },
        { value: 'weights', label: 'Weights' },
        { value: 'bands', label: 'Resistance Bands' },
        { value: 'cardio', label: 'Cardio Equipment' }
    ];

    // Mock exercise data - will be replaced with actual API calls
    const mockExercises = [
        {
            id: 1,
            name: 'Push-ups',
            description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
            category: 'strength',
            equipment: { name: 'Bodyweight', type: 'bodyweight' },
            instructions: 'Start in plank position, lower body until chest nearly touches ground, then push back up',
            videoUrl: null
        },
        {
            id: 2,
            name: 'Dumbbell Rows',
            description: 'Single-arm rowing motion targeting back muscles',
            category: 'strength',
            equipment: { name: 'Dumbbells', type: 'weights' },
            instructions: 'Bend at waist, pull dumbbell up to hip level, keeping elbow close to body',
            videoUrl: null
        },
        {
            id: 3,
            name: 'Squats',
            description: 'Lower body exercise targeting quads, hamstrings, and glutes',
            category: 'strength',
            equipment: { name: 'Bodyweight', type: 'bodyweight' },
            instructions: 'Stand with feet shoulder-width apart, lower body as if sitting back, then return to standing',
            videoUrl: null
        },
        {
            id: 4,
            name: 'Plank Hold',
            description: 'Core stability exercise',
            category: 'strength',
            equipment: { name: 'Bodyweight', type: 'bodyweight' },
            instructions: 'Hold body in straight line from head to heels, engaging core muscles',
            videoUrl: null
        },
        {
            id: 5,
            name: 'Jumping Jacks',
            description: 'Full body cardio exercise',
            category: 'cardio',
            equipment: { name: 'Bodyweight', type: 'bodyweight' },
            instructions: 'Jump while raising arms overhead and spreading legs, then return to starting position',
            videoUrl: null
        },
        {
            id: 6,
            name: 'Resistance Band Rows',
            description: 'Back exercise using resistance bands',
            category: 'strength',
            equipment: { name: 'Resistance Bands', type: 'bands' },
            instructions: 'Anchor band at chest height, pull handles toward chest while squeezing shoulder blades',
            videoUrl: null
        },
        {
            id: 7,
            name: 'Burpees',
            description: 'High-intensity full body exercise',
            category: 'cardio',
            equipment: { name: 'Bodyweight', type: 'bodyweight' },
            instructions: 'Squat, place hands on ground, jump feet back to plank, do push-up, jump feet forward, jump up',
            videoUrl: null
        },
        {
            id: 8,
            name: 'Mountain Climbers',
            description: 'Dynamic cardio exercise with core engagement',
            category: 'cardio',
            equipment: { name: 'Bodyweight', type: 'bodyweight' },
            instructions: 'Start in plank position, alternate bringing knees toward chest in running motion',
            videoUrl: null
        }
    ];

    onMount(() => {
        // Simulate API call
        setTimeout(() => {
            exercises = mockExercises;
            filteredExercises = exercises;
            loading = false;
        }, 500);
    });

    // Filter exercises based on search and filters
    $: {
        filteredExercises = exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
            const matchesEquipment = selectedEquipment === 'all' || exercise.equipment.type === selectedEquipment;

            return matchesSearch && matchesCategory && matchesEquipment;
        });
    }

    function getCategoryIcon(category) {
        const icons = {
            strength: '🏋️',
            cardio: '🏃',
            flexibility: '🧘',
            yoga: '🧘‍♀️',
            sports: '⚽'
        };
        return icons[category] || '🏋️';
    }

    function getEquipmentIcon(equipmentType) {
        const icons = {
            bodyweight: '👤',
            weights: '🏋️',
            bands: '🎯',
            cardio: '🚴'
        };
        return icons[equipmentType] || '👤';
    }

    function addToRoutine(exerciseId) {
        // This would open a modal or navigate to routine creation
        alert(`Exercise ${exerciseId} added to routine!`);
    }

    function viewExercise(exerciseId) {
        // Navigate to exercise detail page
        window.location.href = `/exercises/${exerciseId}`;
    }
</script>

<Nav />

<main class="exercises">
    <div class="exercises-header">
        <div class="exercises-title">
            <h1>Exercise Library</h1>
            <p>Browse and discover exercises for your workouts</p>
        </div>
        <Button variant="primary">
            ➕ Add Exercise
        </Button>
    </div>

    <!-- Search and Filters -->
    <div class="filters">
        <div class="search-box">
            <input
                type="text"
                placeholder="Search exercises..."
                bind:value={searchQuery}
                class="search-input"
            />
        </div>

        <div class="filter-controls">
            <select bind:value={selectedCategory} class="filter-select">
                {#each categories as category}
                    <option value={category.value}>{category.label}</option>
                {/each}
            </select>

            <select bind:value={selectedEquipment} class="filter-select">
                {#each equipmentTypes as equipment}
                    <option value={equipment.value}>{equipment.label}</option>
                {/each}
            </select>
        </div>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading exercises...</p>
        </div>
    {:else if filteredExercises.length === 0}
        <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h2>No exercises found</h2>
            <p>Try adjusting your search or filters</p>
        </div>
    {:else}
        <div class="exercises-grid">
            {#each filteredExercises as exercise}
                <Card class="exercise-card">
                    <div class="exercise-header">
                        <div class="exercise-icon">{getCategoryIcon(exercise.category)}</div>
                        <div class="exercise-info">
                            <h3>{exercise.name}</h3>
                            <p class="exercise-description">{exercise.description}</p>
                        </div>
                    </div>

                    <div class="exercise-meta">
                        <div class="meta-item">
                            <span class="meta-icon">{getEquipmentIcon(exercise.equipment.type)}</span>
                            <span class="meta-text">{exercise.equipment.name}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Category:</span>
                            <span class="meta-text">{exercise.category}</span>
                        </div>
                    </div>

                    {#if exercise.instructions}
                        <div class="exercise-instructions">
                            <h4>Instructions:</h4>
                            <p>{exercise.instructions}</p>
                        </div>
                    {/if}

                    <div class="exercise-actions">
                        <Button variant="primary" size="small" on:click={() => addToRoutine(exercise.id)}>
                            ➕ Add to Routine
                        </Button>
                        <Button variant="secondary" size="small" on:click={() => viewExercise(exercise.id)}>
                            👁️ View Details
                        </Button>
                    </div>
                </Card>
            {/each}
        </div>

        <div class="results-info">
            Showing {filteredExercises.length} of {exercises.length} exercises
        </div>
    {/if}
</main>

<style>
    .exercises {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .exercises-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .exercises-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .exercises-title p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .search-box {
        flex: 1;
        min-width: 250px;
    }

    .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--primary);
    }

    .filter-controls {
        display: flex;
        gap: 0.5rem;
    }

    .filter-select {
        padding: 0.75rem 1rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        background-color: white;
        cursor: pointer;
    }

    .filter-select:focus {
        outline: none;
        border-color: var(--primary);
    }

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--subtle);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .empty-state h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .empty-state p {
        color: var(--tertiary);
        margin: 0;
    }

    .exercises-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .exercise-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .exercise-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .exercise-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .exercise-info h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .exercise-description {
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    .exercise-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .meta-icon {
        font-size: 1rem;
    }

    .meta-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--tertiary);
        min-width: 80px;
    }

    .meta-text {
        font-size: 0.875rem;
        color: var(--primary);
        font-weight: 500;
    }

    .exercise-instructions {
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
    }

    .exercise-instructions h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .exercise-instructions p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    .exercise-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .results-info {
        text-align: center;
        color: var(--tertiary);
        font-size: 0.875rem;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .exercises {
            padding: 1rem;
        }

        .exercises-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .exercises-title h1 {
            font-size: 2rem;
        }

        .filters {
            flex-direction: column;
            align-items: stretch;
        }

        .search-box {
            min-width: auto;
        }

        .filter-controls {
            flex-direction: column;
        }

        .exercises-grid {
            grid-template-columns: 1fr;
        }

        .exercise-actions {
            flex-direction: column;
        }
    }
</style>
