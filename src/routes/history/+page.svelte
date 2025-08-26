<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import AlertModal from '$lib/components/AlertModal.svelte';
    import { onMount } from 'svelte';

    // Get user data from server
    export let data;
    $: ({ user } = data);

    let workoutHistory = [];
    let loading = true;
    let timeframeLoading = false;
    let selectedTimeframe = 'month'; // 'week', 'month', 'year', 'all'
    let selectedView = 'list'; // 'list', 'calendar', 'charts'

    // Alert modal state
    let showAlertModal = false;
    let alertTitle = '';
    let alertMessage = '';
    let alertVariant = 'info';

    onMount(() => {
        fetchWorkoutHistory();
    });

    async function fetchWorkoutHistory() {
        try {
            if (selectedTimeframe !== 'month') {
                timeframeLoading = true;
            } else {
                loading = true;
            }

            const response = await fetch(`/api/workout-history?timeframe=${selectedTimeframe}`);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Please log in to view workout history');
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error('Failed to fetch workout history');
                }
            }

            const data = await response.json();
            workoutHistory = data.workoutHistory || [];
        } catch (error) {
            console.error('Error fetching workout history:', error);
            alertTitle = 'Error';
            alertMessage = error.message || 'Failed to load workout history. Please try again.';
            alertVariant = 'error';
            showAlertModal = true;
            workoutHistory = [];
        } finally {
            loading = false;
            timeframeLoading = false;
        }
    }

    // Watch for timeframe changes and refetch data
    $: if (selectedTimeframe) {
        fetchWorkoutHistory();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    function getDifficultyColor(difficulty) {
        const colors = {
            '😊': 'var(--success)',
            '😐': 'var(--warning)',
            '☹️': 'var(--secondary)'
        };
        return colors[difficulty] || 'var(--text-secondary)';
    }

    function viewWorkoutDetails(workoutId) {
        // Navigate to detailed workout view
        window.location.href = `/history/${workoutId}`;
    }

    function exportHistory() {
        if (workoutHistory.length === 0) {
            alertTitle = 'No Data';
            alertMessage = 'No workout history to export';
            alertVariant = 'info';
            showAlertModal = true;
            return;
        }

        // Create CSV content
        const headers = ['Date', 'Routine', 'Duration (min)', 'Exercises', 'Sets', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...workoutHistory.map(workout => [
                formatDate(workout.startedAt),
                workout.routineName,
                workout.duration,
                workout.exercises.map(ex => ex.name).join('; '),
                workout.totalSets,
                workout.notes || ''
            ].join(','))
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workout-history-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alertTitle = 'Export Successful';
        alertMessage = `Workout history exported as CSV (${workoutHistory.length} workouts)`;
        alertVariant = 'success';
        showAlertModal = true;
    }

    // Calculate stats
    $: totalWorkouts = workoutHistory.length;
    $: totalDuration = workoutHistory.reduce((sum, w) => sum + w.duration, 0);
    $: totalSets = workoutHistory.reduce((sum, w) => sum + w.totalSets, 0);
    $: avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    // Calculate difficulty distribution
    $: difficultyStats = workoutHistory.reduce((stats, workout) => {
        workout.exercises.forEach(exercise => {
            if (exercise.difficulty) {
                stats[exercise.difficulty] = (stats[exercise.difficulty] || 0) + 1;
            }
        });
        return stats;
    }, {});
</script>

<Nav />

<main class="history">
    <div class="history-header">
        <div class="history-title">
            <h1>Workout History</h1>
            <p>Detailed tracking and progress analysis</p>
        </div>
        <div class="history-controls">
            <select bind:value={selectedTimeframe} class="timeframe-select" disabled={timeframeLoading}>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
            </select>
            {#if timeframeLoading}
                <div class="timeframe-loading">⏳</div>
            {/if}
            <Button variant="secondary" on:click={exportHistory}>
                📊 Export Data
            </Button>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
        <Card class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">🏋️</div>
                <div class="stat-info">
                    <span class="stat-value">{totalWorkouts}</span>
                    <span class="stat-label">Total Workouts</span>
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
                <div class="stat-icon">🎯</div>
                <div class="stat-info">
                    <span class="stat-value">{totalSets}</span>
                    <span class="stat-label">Total Sets</span>
                </div>
            </div>
        </Card>

        <Card class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">📈</div>
                <div class="stat-info">
                    <span class="stat-value">{formatDuration(avgDuration)}</span>
                    <span class="stat-label">Avg Duration</span>
                </div>
            </div>
        </Card>
    </div>

    <!-- Difficulty Distribution -->
    {#if Object.keys(difficultyStats).length > 0}
        <Card class="difficulty-chart">
            <h3>Exercise Difficulty Distribution</h3>
            <div class="difficulty-bars">
                {#each Object.entries(difficultyStats) as [difficulty, count]}
                    {@const total = Object.values(difficultyStats).reduce((sum, val) => sum + val, 0)}
                    {@const percentage = Math.round((count / total) * 100)}
                    <div class="difficulty-bar">
                        <div class="difficulty-label">
                            <span class="difficulty-emoji">{difficulty}</span>
                            <span class="difficulty-count">{count}</span>
                        </div>
                        <div class="bar-container">
                            <div
                                class="bar-fill"
                                style="width: {percentage}%; background-color: {getDifficultyColor(difficulty)}"
                            ></div>
                        </div>
                        <span class="percentage">{percentage}%</span>
                    </div>
                {/each}
            </div>
        </Card>
    {/if}

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading workout history...</p>
        </div>
    {:else if workoutHistory.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h2>No workout history</h2>
            <p>Complete your first workout to see detailed tracking here</p>
            <Button variant="primary" href="/routines">
                Start Your First Workout
            </Button>
        </div>
    {:else}
        <div class="workout-history">
            <h2>Detailed Workout History</h2>
            <div class="history-list">
                {#each workoutHistory as workout}
                    <Card class="workout-item">
                        <div class="workout-header">
                            <div class="workout-info">
                                <h3>{workout.routineName}</h3>
                                <p class="workout-date">{formatDate(workout.startedAt)}</p>
                                <p class="workout-duration">Duration: {formatDuration(workout.duration)}</p>
                            </div>
                            <div class="workout-summary">
                                <div class="summary-stat">
                                    <span class="summary-label">Exercises:</span>
                                    <span class="summary-value">{workout.totalExercises}</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="summary-label">Sets:</span>
                                    <span class="summary-value">{workout.totalSets}</span>
                                </div>
                            </div>
                        </div>

                        <div class="exercises-list">
                            <h4>Exercises Completed:</h4>
                            <div class="exercise-items">
                                {#each workout.exercises as exercise}
                                    <div class="exercise-item">
                                        <div class="exercise-name">{exercise.name}</div>
                                        <div class="exercise-details">
                                            {#if exercise.reps}
                                                <span class="detail">{exercise.sets} sets × {exercise.reps} reps</span>
                                            {:else}
                                                <span class="detail">{exercise.sets} sets × {exercise.duration}s</span>
                                            {/if}
                                            {#if exercise.weight}
                                                <span class="detail">@ {exercise.weight} lbs</span>
                                            {/if}
                                        </div>
                                        {#if exercise.difficulty}
                                            <div
                                                class="difficulty-badge"
                                                style="background-color: {getDifficultyColor(exercise.difficulty)}"
                                            >
                                                {exercise.difficulty}
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>

                        {#if workout.notes}
                            <div class="workout-notes">
                                <h4>Notes:</h4>
                                <p>"{workout.notes}"</p>
                            </div>
                        {/if}

                        <div class="workout-actions">
                            <Button variant="secondary" size="small" on:click={() => viewWorkoutDetails(workout.id)}>
                                📊 View Details
                            </Button>
                            <Button variant="primary" size="small" href="/routines">
                                🔄 Repeat Routine
                            </Button>
                        </div>
                    </Card>
                {/each}
            </div>
        </div>
    {/if}

{#if showAlertModal}
    <AlertModal
        bind:isOpen={showAlertModal}
        title={alertTitle}
        message={alertMessage}
        variant={alertVariant}
        on:close={() => showAlertModal = false}
    />
{/if}
</main>

<style>
    .history {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .history-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .history-title p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .history-controls {
        display: flex;
        gap: 1rem;
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

    .timeframe-select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: var(--subtle);
    }

    .timeframe-loading {
        font-size: 1.5rem;
        color: var(--tertiary);
        margin-left: 1rem;
    }

    .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
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

    .difficulty-chart {
        margin-bottom: 2rem;
    }

    .difficulty-chart h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .difficulty-bars {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .difficulty-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .difficulty-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 80px;
    }

    .difficulty-emoji {
        font-size: 1.25rem;
    }

    .difficulty-count {
        font-weight: 600;
        color: var(--primary);
    }

    .bar-container {
        flex: 1;
        height: 20px;
        background-color: var(--subtle);
        border-radius: 10px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        transition: width 0.3s ease;
    }

    .percentage {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--tertiary);
        min-width: 40px;
        text-align: right;
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
        gap: 2rem;
    }

    .workout-item {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .workout-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
    }

    .workout-info h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .workout-date {
        font-size: 1rem;
        color: var(--tertiary);
        margin: 0 0 0.25rem 0;
    }

    .workout-duration {
        font-size: 0.875rem;
        color: var(--accent);
        font-weight: 500;
        margin: 0;
    }

    .workout-summary {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: right;
    }

    .summary-stat {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .summary-label {
        font-size: 0.875rem;
        color: var(--tertiary);
    }

    .summary-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary);
    }

    .exercises-list h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .exercise-items {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .exercise-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .exercise-name {
        font-weight: 600;
        color: var(--primary);
        min-width: 150px;
    }

    .exercise-details {
        display: flex;
        gap: 0.5rem;
        flex: 1;
    }

    .detail {
        font-size: 0.875rem;
        color: var(--tertiary);
        background-color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
    }

    .difficulty-badge {
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 1rem;
        font-weight: 600;
    }

    .workout-notes {
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
    }

    .workout-notes h4 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
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
        .history {
            padding: 1rem;
        }

        .history-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .history-title h1 {
            font-size: 2rem;
        }

        .history-controls {
            flex-direction: column;
        }

        .stats-overview {
            grid-template-columns: repeat(2, 1fr);
        }

        .workout-header {
            flex-direction: column;
            gap: 1rem;
        }

        .workout-summary {
            text-align: left;
        }

        .exercise-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .exercise-details {
            flex-direction: column;
            gap: 0.25rem;
        }

        .workout-actions {
            flex-direction: column;
        }
    }
</style>
