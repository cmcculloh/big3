<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import WorkoutPrintView from '$lib/components/WorkoutPrintView.svelte';

    // Get workout data from server-side load function
    export let data;
    $: ({ workout } = data);

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
            '😊': '#10b981',
            '😐': '#f59e0b',
            '☹️': '#ef4444'
        };
        return colors[difficulty] || '#6b7280';
    }

    function goBack() {
        window.history.back();
    }

    let showPrintView = false;

    function openPrintView() {
        showPrintView = true;
    }

    function closePrintView() {
        showPrintView = false;
    }
</script>

<Nav />

<main class="workout-detail">
    <div class="workout-header">
        <Button variant="secondary" on:click={goBack} class="back-button">
            ← Back to History
        </Button>
        <div class="workout-title">
            <h1>{workout.routineName}</h1>
            <p class="workout-date">{formatDate(workout.startedAt)}</p>
        </div>
        <Button variant="primary" on:click={openPrintView} class="print-button">
            🖨️ Print Workout
        </Button>
    </div>

    <!-- Workout Summary -->
    <div class="workout-summary">
        <Card class="summary-card">
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Duration</span>
                    <span class="summary-value">{formatDuration(workout.duration)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Exercises</span>
                    <span class="summary-value">{workout.totalExercises}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Sets</span>
                    <span class="summary-value">{workout.totalSets}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Started</span>
                    <span class="summary-value">{formatDate(workout.startedAt)}</span>
                </div>
                {#if workout.completedAt}
                    <div class="summary-item">
                        <span class="summary-label">Completed</span>
                        <span class="summary-value">{formatDate(workout.completedAt)}</span>
                    </div>
                {/if}
            </div>
        </Card>
    </div>

    <!-- Exercises -->
    <div class="exercises-section">
        <h2>Exercises Completed</h2>
        <div class="exercises-list">
            {#each workout.exercises as exercise}
                <Card class="exercise-card">
                    <div class="exercise-header">
                        <h3>{exercise.name}</h3>
                        {#if exercise.difficulty}
                            <div
                                class="difficulty-badge"
                                style="background-color: {getDifficultyColor(exercise.difficulty)}"
                            >
                                {exercise.difficulty}
                            </div>
                        {/if}
                    </div>

                    <div class="exercise-details">
                        <div class="detail-row">
                            <span class="detail-label">Sets:</span>
                            <span class="detail-value">{exercise.sets}</span>
                        </div>

                        {#if exercise.reps}
                            <div class="detail-row">
                                <span class="detail-label">Reps:</span>
                                <span class="detail-value">{exercise.reps}</span>
                            </div>
                        {:else if exercise.duration}
                            <div class="detail-row">
                                <span class="detail-label">Duration:</span>
                                <span class="detail-value">{exercise.duration}s</span>
                            </div>
                        {/if}

                        {#if exercise.weight}
                            <div class="detail-row">
                                <span class="detail-label">Weight:</span>
                                <span class="detail-value">{exercise.weight} lbs</span>
                            </div>
                        {/if}

                        {#if exercise.bandStrength}
                            <div class="detail-row">
                                <span class="detail-label">Band Strength:</span>
                                <span class="detail-value">{exercise.bandStrength}</span>
                            </div>
                        {/if}
                    </div>

                    {#if exercise.notes}
                        <div class="exercise-notes">
                            <span class="notes-label">Notes:</span>
                            <span class="notes-text">{exercise.notes}</span>
                        </div>
                    {/if}
                </Card>
            {/each}
        </div>
    </div>

    <!-- Workout Notes -->
    {#if workout.notes}
        <div class="workout-notes-section">
            <h2>Workout Notes</h2>
            <Card class="notes-card">
                <p class="notes-text">"{workout.notes}"</p>
            </Card>
        </div>
    {/if}

    <!-- Actions -->
    <div class="workout-actions">
        <Button variant="primary" href="/routines">
            🔄 Repeat Routine
        </Button>
        <Button variant="secondary" href="/history">
            📊 Back to History
        </Button>
    </div>
</main>

{#if showPrintView}
    <div class="print-view-overlay">
        <WorkoutPrintView
            routine={workout}
            showPrintButton={true}
            on:back={closePrintView}
        />
    </div>
{/if}

<style>
    .workout-detail {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    .workout-header {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .back-button {
        flex-shrink: 0;
    }

    .workout-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .workout-date {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .workout-summary {
        margin-bottom: 2rem;
    }

    .summary-card {
        padding: 1.5rem;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .summary-label {
        font-size: 0.875rem;
        color: var(--tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }

    .summary-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
    }

    .exercises-section {
        margin-bottom: 2rem;
    }

    .exercises-section h2 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        color: var(--primary);
    }

    .exercises-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .exercise-card {
        padding: 1.5rem;
    }

    .exercise-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .exercise-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: var(--primary);
    }

    .difficulty-badge {
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 1.125rem;
        font-weight: 600;
    }

    .exercise-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background-color: var(--subtle);
        border-radius: 0.25rem;
    }

    .detail-label {
        font-size: 0.875rem;
        color: var(--tertiary);
        font-weight: 500;
    }

    .detail-value {
        font-weight: 600;
        color: var(--primary);
    }

    .exercise-notes {
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
    }

    .notes-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary);
        margin-right: 0.5rem;
    }

    .notes-text {
        font-size: 0.875rem;
        color: var(--tertiary);
        font-style: italic;
    }

    .workout-notes-section {
        margin-bottom: 2rem;
    }

    .workout-notes-section h2 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        color: var(--primary);
    }

    .notes-card {
        padding: 1.5rem;
    }

    .notes-text {
        font-size: 1.125rem;
        color: var(--tertiary);
        font-style: italic;
        margin: 0;
        line-height: 1.6;
    }

    .workout-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 3rem;
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

    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
    }

    .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .error-state h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .error-state p {
        color: var(--tertiary);
        margin: 0 0 2rem 0;
    }

    @media (max-width: 768px) {
        .workout-detail {
            padding: 1rem;
        }

        .workout-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: 1rem;
        }

        .workout-title h1 {
            font-size: 2rem;
        }

        .summary-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .exercise-details {
            grid-template-columns: 1fr;
        }

        .workout-actions {
            flex-direction: column;
        }
    }

    .print-view-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        overflow-y: auto;
        padding: 20px;
    }

    .print-button {
        margin-left: auto;
    }
</style>
