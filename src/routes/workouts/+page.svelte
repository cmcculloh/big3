<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let workoutHistory = [];
    let loading = true;
    let selectedTimeframe = 'week'; // 'week', 'month', 'all'

    // Mock workout history data
    const mockHistory = [
        {
            id: 1,
            routineName: 'Upper Body Strength',
            startedAt: '2024-01-15T10:30:00',
            completedAt: '2024-01-15T11:15:00',
            duration: 45,
            exercises: 6,
            totalSets: 18,
            notes: 'Felt strong today, increased weight on rows'
        },
        {
            id: 2,
            routineName: 'Cardio Circuit',
            startedAt: '2024-01-12T09:00:00',
            completedAt: '2024-01-12T09:35:00',
            duration: 35,
            exercises: 8,
            totalSets: 24,
            notes: 'Great cardio session, maintained good pace'
        },
        {
            id: 3,
            routineName: 'Full Body Workout',
            startedAt: '2024-01-10T14:00:00',
            completedAt: '2024-01-10T15:05:00',
            duration: 65,
            exercises: 10,
            totalSets: 30,
            notes: 'Challenging but rewarding workout'
        },
        {
            id: 4,
            routineName: 'Upper Body Strength',
            startedAt: '2024-01-08T10:30:00',
            completedAt: '2024-01-08T11:10:00',
            duration: 40,
            exercises: 6,
            totalSets: 18,
            notes: 'Good form, felt the burn'
        }
    ];

    onMount(() => {
        // Simulate API call
        setTimeout(() => {
            workoutHistory = mockHistory;
            loading = false;
        }, 500);
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    function getTimeframeLabel(timeframe) {
        const labels = {
            week: 'This Week',
            month: 'This Month',
            all: 'All Time'
        };
        return labels[timeframe];
    }

    function viewWorkoutDetails(workoutId) {
        // Navigate to workout details page
        window.location.href = `/workouts/${workoutId}`;
    }

    function repeatWorkout(workoutId) {
        // Start the same routine again
        window.location.href = `/workout/${workoutId}`;
    }

    // Calculate stats
    $: totalWorkouts = workoutHistory.length;
    $: totalDuration = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
    $: totalExercises = workoutHistory.reduce((sum, w) => sum + w.exercises, 0);
    $: totalSets = workoutHistory.reduce((sum, w) => sum + w.totalSets, 0);
</script>

<Nav />

<main class="workouts">
    <div class="workouts-header">
        <div class="workouts-title">
            <h1>Workout History</h1>
            <p>Track your fitness journey and progress</p>
        </div>
        <div class="timeframe-selector">
            <select bind:value={selectedTimeframe} class="timeframe-select">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
            </select>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
        <Card class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">🏋️</div>
                <div class="stat-info">
                    <span class="stat-value">{totalWorkouts}</span>
                    <span class="stat-label">Workouts</span>
                </div>
            </div>
        </Card>

        <Card class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">⏱️</div>
                <div class="stat-info">
                    <span class="stat-value">{formatDuration(totalDuration)}</span>
                    <span class="stat-label">Total Time</span>
                </div>
            </div>
        </Card>

        <Card class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">💪</div>
                <div class="stat-info">
                    <span class="stat-value">{totalExercises}</span>
                    <span class="stat-label">Exercises</span>
                </div>
            </div>
        </Card>

        <Card class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">🎯</div>
                <div class="stat-info">
                    <span class="stat-value">{totalSets}</span>
                    <span class="stat-label">Total Sets</span>
                </div>
            </div>
        </Card>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading workout history...</p>
        </div>
    {:else if workoutHistory.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h2>No workouts yet</h2>
            <p>Complete your first workout to see your progress here</p>
            <Button variant="primary" href="/routines">
                Start Your First Workout
            </Button>
        </div>
    {:else}
        <div class="workout-history">
            <h2>Recent Workouts</h2>
            <div class="history-list">
                {#each workoutHistory as workout}
                    <Card class="workout-item">
                        <div class="workout-header">
                            <div class="workout-info">
                                <h3>{workout.routineName}</h3>
                                <p class="workout-date">{formatDate(workout.startedAt)}</p>
                            </div>
                            <div class="workout-stats">
                                <div class="stat">
                                    <span class="stat-label">Duration</span>
                                    <span class="stat-value">{formatDuration(workout.duration)}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Exercises</span>
                                    <span class="stat-value">{workout.exercises}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Sets</span>
                                    <span class="stat-value">{workout.totalSets}</span>
                                </div>
                            </div>
                        </div>

                        {#if workout.notes}
                            <div class="workout-notes">
                                <p>"{workout.notes}"</p>
                            </div>
                        {/if}

                        <div class="workout-actions">
                            <Button variant="secondary" size="small" on:click={() => viewWorkoutDetails(workout.id)}>
                                📊 View Details
                            </Button>
                            <Button variant="primary" size="small" on:click={() => repeatWorkout(workout.id)}>
                                🔄 Repeat Workout
                            </Button>
                        </div>
                    </Card>
                {/each}
            </div>
        </div>
    {/if}
</main>

<style>
    .workouts {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .workouts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .workouts-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .workouts-title p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .timeframe-selector {
        display: flex;
        align-items: center;
    }

    .timeframe-select {
        padding: 0.75rem 1rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        background-color: white;
        cursor: pointer;
    }

    .timeframe-select:focus {
        outline: none;
        border-color: var(--primary);
    }

    .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .stat-card {
        padding: 1.5rem;
    }

    .stat-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .stat-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .stat-info {
        display: flex;
        flex-direction: column;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
        line-height: 1;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 0.25rem;
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

    .workout-history h2 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        color: var(--primary);
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .workout-item {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .workout-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
    }

    .workout-info h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .workout-date {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
    }

    .workout-stats {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .workout-stats .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        min-width: 60px;
    }

    .workout-stats .stat-label {
        font-size: 0.75rem;
        color: var(--tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .workout-stats .stat-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary);
        margin-top: 0.25rem;
    }

    .workout-notes {
        padding: 1rem;
        background-color: var(--cyan-50);
        border-radius: 0.5rem;
        border-left: 4px solid var(--cyan-500);
    }

    .workout-notes p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
        font-style: italic;
    }

    .workout-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    @media (max-width: 768px) {
        .workouts {
            padding: 1rem;
        }

        .workouts-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .workouts-title h1 {
            font-size: 2rem;
        }

        .stats-overview {
            grid-template-columns: repeat(2, 1fr);
        }

        .workout-header {
            flex-direction: column;
            gap: 1rem;
        }

        .workout-stats {
            justify-content: center;
        }

        .workout-actions {
            flex-direction: column;
        }
    }
</style>