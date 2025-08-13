<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    // Get routine ID from URL
    $: routineId = $page.params.id;

    let routine = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            console.log('🔍 Loading routine with ID:', routineId);

            // Fetch the real routine data from the database
            const response = await fetch(`/api/routines/${routineId}`);
            console.log('📡 API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Routine data received:', data);
                routine = data.routine;
            } else {
                // Fallback to mock data if API fails
                console.warn('⚠️ Failed to fetch routine, using mock data. Status:', response.status);
                const errorText = await response.text();
                console.warn('Error response:', errorText);
                routine = mockRoutine;
            }

            loading = false;
        } catch (err) {
            console.error('❌ Error loading routine:', err);
            // Fallback to mock data
            routine = mockRoutine;
            loading = false;
        }
    });

    function startWorkout() {
        window.location.href = `/workout/${routineId}`;
    }

    function editRoutine() {
        window.location.href = `/routines/${routineId}/edit`;
    }

    function deleteRoutine() {
        if (confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
            // In a real app, you'd call your delete API here
            window.location.href = '/routines';
        }
    }

    function getCategoryIcon(category) {
        const icons = {
            strength: '🏋️',
            cardio: '🏃',
            full_body: '💪',
            flexibility: '🧘',
            yoga: '🧘‍♀️'
        };
        return icons[category] || '🏋️';
    }

    function formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
</script>

<Nav />

<main class="routine-detail">
    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading routine...</p>
        </div>
    {:else if error}
        <div class="error">
            <h2>Error loading routine</h2>
            <p>{error}</p>
            <Button variant="secondary" href="/routines">← Back to Routines</Button>
        </div>
    {:else if routine}
        <div class="routine-header">
            <div class="routine-title">
                <div class="routine-icon">{getCategoryIcon(routine.category)}</div>
                <div class="routine-info">
                    <h1>{routine.name}</h1>
                    <p class="routine-description">{routine.description}</p>
                    <div class="routine-meta">
                        <span class="meta-item">📅 {routine.category}</span>
                        <span class="meta-item">⏱️ {formatDuration(routine.estimatedDuration)}</span>
                        <span class="meta-item">🏋️ {routine.exercises.length} exercises</span>
                    </div>
                </div>
            </div>
            <div class="routine-actions">
                <Button variant="success" on:click={startWorkout}>
                    ▶️ Start Workout
                </Button>
                <Button variant="secondary" on:click={editRoutine}>
                    ✏️ Edit
                </Button>
                <Button variant="danger" on:click={deleteRoutine}>
                    🗑️ Delete
                </Button>
            </div>
        </div>

        <div class="routine-content">
            <Card class="exercises-section">
                <h2>Exercises</h2>
                <div class="exercises-list">
                    {#each routine.exercises as exercise, index}
                        <div class="exercise-item">
                            <div class="exercise-header">
                                <div class="exercise-number">{index + 1}</div>
                                <div class="exercise-info">
                                    <h3>{exercise.name}</h3>
                                    <p>{exercise.description}</p>
                                </div>
                                <div class="exercise-category exercise-category-{exercise.category}">
                                    {exercise.category}
                                </div>
                            </div>

                            <div class="exercise-details">
                                {#if exercise.sets && exercise.reps}
                                    <span class="detail-item">Sets: {exercise.sets}</span>
                                    <span class="detail-item">Reps: {exercise.reps}</span>
                                {:else if exercise.duration}
                                    <span class="detail-item">Duration: {Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, '0')}</span>
                                {/if}

                                {#if exercise.restBetweenSets > 0}
                                    <span class="detail-item">Rest: {exercise.restBetweenSets}s</span>
                                {/if}

                                {#if exercise.weight}
                                    <span class="detail-item">Weight: {exercise.weight}lbs</span>
                                {/if}

                                {#if exercise.bandStrength}
                                    <span class="detail-item">Band: {exercise.bandStrength}</span>
                                {/if}
                            </div>

                            {#if exercise.notes}
                                <div class="exercise-notes">
                                    <strong>Notes:</strong> {exercise.notes}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </Card>
        </div>
    {:else}
        <div class="not-found">
            <h2>Routine not found</h2>
            <p>The routine you're looking for doesn't exist or has been deleted.</p>
            <Button variant="secondary" href="/routines">← Back to Routines</Button>
        </div>
    {/if}
</main>

<style>
    .routine-detail {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .routine-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        gap: 2rem;
    }

    .routine-title {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        flex: 1;
    }

    .routine-icon {
        font-size: 3rem;
        flex-shrink: 0;
    }

    .routine-info h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2.5rem;
        color: var(--text-primary);
    }

    .routine-description {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        color: var(--text-secondary);
        line-height: 1.5;
    }

    .routine-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .meta-item {
        background: var(--bg-secondary);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .routine-actions {
        display: flex;
        gap: 1rem;
        flex-shrink: 0;
    }

    .routine-content {
        margin-top: 2rem;
    }

    .exercises-section h2 {
        margin: 0 0 1.5rem 0;
        color: var(--text-primary);
    }

    .exercises-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .exercise-item {
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        background: var(--bg-secondary);
    }

    .exercise-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .exercise-number {
        background: var(--primary-color);
        color: white;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
    }

    .exercise-info {
        flex: 1;
    }

    .exercise-info h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
    }

    .exercise-info p {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    .exercise-category {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        flex-shrink: 0;
    }

    .exercise-category-warmup {
        background: #e3f2fd;
        color: #1976d2;
    }

    .exercise-category-main {
        background: #e8f5e8;
        color: #388e3c;
    }

    .exercise-category-cooldown {
        background: #fff3e0;
        color: #f57c00;
    }

    .exercise-details {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }

    .detail-item {
        background: var(--bg-primary);
        padding: 0.25rem 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
    }

    .exercise-notes {
        background: var(--bg-primary);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid var(--primary-color);
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .loading, .error, .not-found {
        text-align: center;
        padding: 4rem 2rem;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border-color);
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .routine-header {
            flex-direction: column;
            align-items: stretch;
        }

        .routine-actions {
            justify-content: center;
        }

        .routine-detail {
            padding: 1rem;
        }
    }
</style>
