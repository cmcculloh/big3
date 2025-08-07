<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import Timer from '$lib/components/Timer.svelte';
    import DifficultyRating from '$lib/components/DifficultyRating.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    // Get routine ID from URL
    $: routineId = $page.params.id;

    let routine = null;
    let currentExerciseIndex = 0;
    let currentSet = 1;
    let workoutStarted = false;
    let workoutCompleted = false;
    let showDifficultyRating = false;
    let currentDifficulty = null;
    let loading = true;
    let showWeightAdjustment = false;
    let weightAdjustments = {};

    // Mock routine data - will be replaced with actual API call
    const mockRoutine = {
        id: routineId,
        name: 'Upper Body Strength',
        exercises: [
            {
                id: 1,
                exercise: { name: 'Push-ups', description: 'Standard push-ups', category: 'strength' },
                template: { sets: 3, reps: 10, weight: null, bandStrength: null, restBetweenSets: 60 },
                equipment: { name: 'Bodyweight', type: 'bodyweight' }
            },
            {
                id: 2,
                exercise: { name: 'Dumbbell Rows', description: 'Single-arm dumbbell rows', category: 'strength' },
                template: { sets: 3, reps: 12, weight: 25, bandStrength: null, restBetweenSets: 60 },
                equipment: { name: 'Dumbbells', type: 'weights' }
            },
            {
                id: 3,
                exercise: { name: 'Plank Hold', description: 'Hold plank position', category: 'strength' },
                template: { sets: 3, duration: 30, weight: null, bandStrength: null, restBetweenSets: 45 },
                equipment: { name: 'Bodyweight', type: 'bodyweight' }
            }
        ]
    };

    onMount(() => {
        // Simulate API call
        setTimeout(() => {
            routine = mockRoutine;
            loading = false;
        }, 500);
    });

    function startWorkout() {
        workoutStarted = true;
        showWeightAdjustment = true;
    }

    function handleWeightAdjustment() {
        showWeightAdjustment = false;
        // Start first exercise
        startNextSet();
    }

    function startNextSet() {
        if (currentSet > routine.exercises[currentExerciseIndex].template.sets) {
            // Move to next exercise
            if (currentExerciseIndex < routine.exercises.length - 1) {
                currentExerciseIndex++;
                currentSet = 1;
                showDifficultyRating = true;
            } else {
                // Workout completed
                workoutCompleted = true;
            }
        }
    }

    function handleDifficultyRating(event) {
        currentDifficulty = event.detail.value;
        showDifficultyRating = false;

        // Store difficulty for weight adjustment
        const exerciseId = routine.exercises[currentExerciseIndex].id;
        if (!weightAdjustments[exerciseId]) {
            weightAdjustments[exerciseId] = [];
        }
        weightAdjustments[exerciseId].push(currentDifficulty);

        // Move to next set
        currentSet++;
        startNextSet();
    }

    function handleTimerComplete() {
        // Timer finished, show difficulty rating
        showDifficultyRating = true;
    }

    function handleDoneClick() {
        if (showDifficultyRating) {
            // User clicked done without rating, assume neutral
            handleDifficultyRating({ detail: { value: '😐' } });
        } else {
            // Move to next set
            currentSet++;
            startNextSet();
        }
    }

    function getCurrentExercise() {
        if (!routine || currentExerciseIndex >= routine.exercises.length) return null;
        return routine.exercises[currentExerciseIndex];
    }

    function getProgressPercentage() {
        if (!routine) return 0;
        const totalSets = routine.exercises.reduce((sum, ex) => sum + ex.template.sets, 0);
        const completedSets = routine.exercises.slice(0, currentExerciseIndex).reduce((sum, ex) => sum + ex.template.sets, 0) + currentSet - 1;
        return Math.min((completedSets / totalSets) * 100, 100);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
</script>

<Nav />

<main class="workout">
    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading workout...</p>
        </div>
    {:else if !workoutStarted}
        <div class="workout-start">
            <Card>
                <div class="start-content">
                    <h1>{routine.name}</h1>
                    <div class="workout-info">
                        <div class="info-item">
                            <span class="info-label">Exercises:</span>
                            <span class="info-value">{routine.exercises.length}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Total Sets:</span>
                            <span class="info-value">{routine.exercises.reduce((sum, ex) => sum + ex.template.sets, 0)}</span>
                        </div>
                    </div>
                    <Button variant="primary" size="large" on:click={startWorkout}>
                        🏃 Start Workout
                    </Button>
                </div>
            </Card>
        </div>
    {:else if showWeightAdjustment}
        <div class="weight-adjustment">
            <Card>
                <h2>Weight Adjustments</h2>
                <p>Based on your previous workouts, would you like to adjust weights?</p>
                <div class="adjustment-options">
                    <Button variant="success" on:click={handleWeightAdjustment}>
                        Yes, adjust weights
                    </Button>
                    <Button variant="secondary" on:click={handleWeightAdjustment}>
                        No, keep current weights
                    </Button>
                </div>
            </Card>
        </div>
    {:else if workoutCompleted}
        <div class="workout-complete">
            <Card>
                <div class="complete-content">
                    <h1>🎉 Workout Complete!</h1>
                    <p>Great job! You've finished your workout.</p>
                    <div class="complete-actions">
                        <Button variant="primary" href="/routines">
                            Back to Routines
                        </Button>
                        <Button variant="secondary" href="/history">
                            View History
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    {:else}
        <div class="workout-session">
            <!-- Progress Bar -->
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {getProgressPercentage()}%"></div>
                </div>
                <div class="progress-text">
                    {Math.round(getProgressPercentage())}% Complete
                </div>
            </div>

            <!-- Current Exercise -->
            {#if getCurrentExercise()}
                {@const exercise = getCurrentExercise()}
                <Card class="exercise-card">
                    <div class="exercise-header">
                        <h2>{exercise.exercise.name}</h2>
                        <p class="exercise-description">{exercise.exercise.description}</p>
                        <div class="exercise-meta">
                            <span class="meta-item">Set {currentSet} of {exercise.template.sets}</span>
                            <span class="meta-item">Exercise {currentExerciseIndex + 1} of {routine.exercises.length}</span>
                        </div>
                    </div>

                    <div class="exercise-content">
                        {#if exercise.template.duration}
                            <!-- Duration-based exercise -->
                            <div class="timer-section">
                                <Timer
                                    duration={exercise.template.duration}
                                    autoStart={true}
                                    showControls={false}
                                    on:complete={handleTimerComplete}
                                />
                            </div>
                        {:else}
                            <!-- Rep-based exercise -->
                            <div class="reps-section">
                                <div class="reps-display">
                                    <span class="reps-number">{exercise.template.reps}</span>
                                    <span class="reps-label">reps</span>
                                </div>
                            </div>
                        {/if}

                        {#if exercise.template.weight}
                            <div class="weight-display">
                                <span class="weight-label">Weight:</span>
                                <span class="weight-value">{exercise.template.weight} lbs</span>
                            </div>
                        {/if}

                        {#if exercise.template.bandStrength}
                            <div class="band-display">
                                <span class="band-label">Band:</span>
                                <span class="band-value">{exercise.template.bandStrength}</span>
                            </div>
                        {/if}
                    </div>

                    {#if showDifficultyRating}
                        <div class="difficulty-section">
                            <DifficultyRating on:change={handleDifficultyRating} />
                        </div>
                    {:else}
                        <div class="action-section">
                            <Button variant="success" size="large" fullWidth={true} on:click={handleDoneClick}>
                                ✅ Done
                            </Button>
                        </div>
                    {/if}
                </Card>
            {/if}
        </div>
    {/if}
</main>

<style>
    .workout {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
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

    .workout-start,
    .weight-adjustment,
    .workout-complete {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
    }

    .start-content,
    .complete-content {
        text-align: center;
        padding: 2rem;
    }

    .start-content h1,
    .complete-content h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .workout-info {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin: 2rem 0;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info-label {
        font-size: 0.875rem;
        color: var(--tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .info-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--primary);
        margin-top: 0.25rem;
    }

    .adjustment-options {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .complete-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .workout-session {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .progress-container {
        background-color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: var(--subtle);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        transition: width 0.3s ease;
    }

    .progress-text {
        text-align: center;
        font-weight: 600;
        color: var(--primary);
    }

    .exercise-card {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .exercise-header {
        text-align: center;
    }

    .exercise-header h2 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .exercise-description {
        color: var(--tertiary);
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
    }

    .exercise-meta {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    .meta-item {
        font-size: 0.875rem;
        color: var(--tertiary);
        font-weight: 500;
    }

    .exercise-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .timer-section,
    .reps-section {
        display: flex;
        justify-content: center;
    }

    .reps-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .reps-number {
        font-size: 4rem;
        font-weight: 800;
        color: var(--primary);
    }

    .reps-label {
        font-size: 1.25rem;
        color: var(--tertiary);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .weight-display,
    .band-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .weight-label,
    .band-label {
        font-weight: 600;
        color: var(--tertiary);
    }

    .weight-value,
    .band-value {
        font-weight: 700;
        color: var(--primary);
    }

    .difficulty-section,
    .action-section {
        display: flex;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .workout {
            padding: 1rem;
        }

        .start-content h1,
        .complete-content h1 {
            font-size: 2rem;
        }

        .workout-info {
            flex-direction: column;
            gap: 1rem;
        }

        .adjustment-options,
        .complete-actions {
            flex-direction: column;
        }

        .exercise-header h2 {
            font-size: 1.5rem;
        }

        .exercise-meta {
            flex-direction: column;
            gap: 0.5rem;
        }

        .reps-number {
            font-size: 3rem;
        }
    }
</style>
