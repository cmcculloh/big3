<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let routines = [];
    let loading = true;
    let showCreateForm = false;

    // Mock data for now - will be replaced with actual API calls
    const mockRoutines = [
        {
            id: 1,
            name: 'Upper Body Strength',
            description: 'Focus on chest, back, and arms',
            category: 'strength',
            estimatedDuration: 45,
            exerciseCount: 6,
            lastUsed: '2024-01-15'
        },
        {
            id: 2,
            name: 'Cardio Circuit',
            description: 'High-intensity interval training',
            category: 'cardio',
            estimatedDuration: 30,
            exerciseCount: 8,
            lastUsed: '2024-01-12'
        },
        {
            id: 3,
            name: 'Full Body Workout',
            description: 'Complete body workout for all muscle groups',
            category: 'full_body',
            estimatedDuration: 60,
            exerciseCount: 10,
            lastUsed: '2024-01-10'
        }
    ];

    onMount(() => {
        // Simulate API call
        setTimeout(() => {
            routines = mockRoutines;
            loading = false;
        }, 500);
    });

    function startWorkout(routineId) {
        // Navigate to workout session
        window.location.href = `/workout/${routineId}`;
    }

    function editRoutine(routineId) {
        // Navigate to edit routine page
        window.location.href = `/routines/${routineId}/edit`;
    }

    function deleteRoutine(routineId) {
        if (confirm('Are you sure you want to delete this routine?')) {
            routines = routines.filter(r => r.id !== routineId);
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

<main class="routines">
    <div class="routines-header">
        <div class="routines-title">
            <h1>My Routines</h1>
            <p>Manage and organize your workout routines</p>
        </div>
        <Button variant="primary" href="/routines/create">
            ➕ Create Routine
        </Button>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading your routines...</p>
        </div>
    {:else if routines.length === 0}
        <div class="empty-state">
            <div class="empty-icon">🏋️</div>
            <h2>No routines yet</h2>
            <p>Create your first workout routine to get started</p>
            <Button variant="primary" on:click={() => showCreateForm = true}>
                Create Your First Routine
            </Button>
        </div>
    {:else}
        <div class="routines-grid">
            {#each routines as routine}
                <Card class="routine-card">
                    <div class="routine-header">
                        <div class="routine-icon">{getCategoryIcon(routine.category)}</div>
                        <div class="routine-info">
                            <h3>{routine.name}</h3>
                            <p class="routine-description">{routine.description}</p>
                        </div>
                    </div>

                    <div class="routine-stats">
                        <div class="stat">
                            <span class="stat-label">Duration</span>
                            <span class="stat-value">{formatDuration(routine.estimatedDuration)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Exercises</span>
                            <span class="stat-value">{routine.exerciseCount}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Last Used</span>
                            <span class="stat-value">{routine.lastUsed}</span>
                        </div>
                    </div>

                    <div class="routine-actions">
                        <Button variant="success" size="small" on:click={() => startWorkout(routine.id)}>
                            ▶️ Start
                        </Button>
                        <Button variant="secondary" size="small" on:click={() => editRoutine(routine.id)}>
                            ✏️ Edit
                        </Button>
                        <Button variant="danger" size="small" on:click={() => deleteRoutine(routine.id)}>
                            🗑️ Delete
                        </Button>
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</main>

<style>
    .routines {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .routines-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .routines-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .routines-title p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
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
        margin: 0 0 2rem 0;
    }

    .routines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
    }

    .routine-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .routine-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .routine-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .routine-info h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .routine-description {
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    .routine-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        padding: 1rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .stat-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .stat-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary);
        margin-top: 0.25rem;
    }

    .routine-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    @media (max-width: 768px) {
        .routines {
            padding: 1rem;
        }

        .routines-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .routines-title h1 {
            font-size: 2rem;
        }

        .routines-grid {
            grid-template-columns: 1fr;
        }

        .routine-stats {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .routine-actions {
            flex-direction: column;
        }
    }
</style>
