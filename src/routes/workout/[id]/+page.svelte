<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import Timer from '$lib/components/Timer.svelte';
    import DifficultyRating from '$lib/components/DifficultyRating.svelte';
    import WorkoutPrintView from '$lib/components/WorkoutPrintView.svelte';
    import { page } from '$app/stores';

    // Get routine ID from URL and data from server
    let routineId = $derived($page.params.id);
    let { data } = $props();

    let routine = data.routine;
    let currentExerciseIndex = $state(0);
    let currentSetNumber = $state(1); // Track current set within exercise
    let workoutStarted = $state(false);
    let workoutCompleted = $state(false);
    let loading = $state(false);
    let exerciseResults = $state([]); // Store results for each exercise
    let showPrintView = $state(false);

    // Initialize routine from server data
    routine = data.routine;
    loading = false;

    // Debug: Log routine data
    console.log('=== ROUTINE DATA ===');
    console.log('Routine:', routine);
    console.log('Exercises array:', routine?.exercises);
    if (routine?.exercises) {
        routine.exercises.forEach((ex, i) => {
            console.log(`Exercise ${i}:`, ex.exercise?.name);
        });
    }

    function startWorkout() {
        workoutStarted = true;
        currentExerciseIndex = 0;
        currentSetNumber = 1; // Start with set 1
        // Initialize exercise results
        exerciseResults = routine.exercises.map(exercise => ({
            exerciseId: exercise.id,
            exerciseName: exercise.exercise.name,
            targetReps: exercise.template.reps || 0,
            targetDuration: exercise.template.duration || 0,
            actualReps: exercise.template.reps || 0,
            actualDuration: exercise.template.duration || 0,
            difficulty: null,
            notes: ''
        }));
    }

    function moveToNextSet() {
        const currentExercise = routine.exercises[currentExerciseIndex];
        const totalSets = currentExercise.template.sets || 1;

        console.log('=== MOVING TO NEXT SET ===');
        console.log('Current set:', currentSetNumber);
        console.log('Total sets:', totalSets);

        if (currentSetNumber < totalSets) {
            // Move to next set within same exercise
            currentSetNumber++;
            console.log('Moved to set:', currentSetNumber);
        } else {
            // All sets completed for this exercise, move to next exercise
            moveToNextExercise();
        }
    }

    function moveToNextExercise() {
        console.log('=== MOVING TO NEXT EXERCISE ===');
        console.log('Current index before:', currentExerciseIndex);
        console.log('Total exercises:', routine.exercises.length);

        if (currentExerciseIndex < routine.exercises.length - 1) {
            currentExerciseIndex++;
            currentSetNumber = 1; // Reset set number for new exercise
            console.log('Moved to exercise index:', currentExerciseIndex);
            console.log('Exercise name:', routine.exercises[currentExerciseIndex]?.exercise?.name);
            console.log('Reset set number to:', currentSetNumber);
        } else {
            // Workout completed
            console.log('Workout completed!');
            workoutCompleted = true;
        }
    }

    function handleDoneClick() {
        // Move to next set or next exercise
        moveToNextSet();
    }

    function handleTimerComplete() {
        // Timer finished, automatically move to next exercise
        moveToNextExercise();
    }

    function updateExerciseResult(field, value) {
        exerciseResults[currentExerciseIndex][field] = value;
    }

    function saveWorkoutResults() {
        // Here you would save the workout results to the database
        console.log('Saving workout results:', exerciseResults);
        // Navigate back to routines or show success message
    }

    function getCurrentExercise() {
        console.log('=== GETTING CURRENT EXERCISE ===');
        console.log('Current index:', currentExerciseIndex);
        console.log('Routine exists:', !!routine);
        console.log('Exercises array length:', routine?.exercises?.length);
        console.log('Index in bounds:', currentExerciseIndex < (routine?.exercises?.length || 0));

        if (!routine || currentExerciseIndex >= routine.exercises.length) {
            console.log('Returning null - no exercise found');
            return null;
        }

        const exercise = routine.exercises[currentExerciseIndex];
        console.log('Returning exercise:', exercise?.exercise?.name);
        return exercise;
    }

    function getProgressPercentage() {
        if (!routine) return 0;
        return Math.min(((currentExerciseIndex + 1) / routine.exercises.length) * 100, 100);
    }

    function openPrintView() {
        showPrintView = true;
    }

    function closePrintView() {
        showPrintView = false;
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
    {:else if !routine}
        <div class="error-state">
            <Card>
                <div class="error-content">
                    <h1>❌ Routine Not Found</h1>
                    <p>The routine you're looking for doesn't exist or has been deleted.</p>
                    <div class="error-actions">
                        <Button variant="primary" href="/routines">
                            Back to Routines
                        </Button>
                    </div>
                </div>
            </Card>
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
                    </div>
                    <div class="start-actions">
                        <Button variant="primary" size="large" on:click={startWorkout}>
                            🏃 Start Workout
                        </Button>
                        <Button variant="secondary" size="large" on:click={openPrintView}>
                            🖨️ Print Workout
                        </Button>
                    </div>
                </div>
            </Card>
        </div>

    {:else if workoutCompleted}
        <div class="workout-complete">
            <Card>
                <div class="complete-content">
                    <h1>🎉 Workout Complete!</h1>
                    <p>Great job! You've finished your workout. Rate your exercises and adjust your actual performance below.</p>

                    <div class="exercise-summary">
                        {#each exerciseResults as result, index}
                            <div class="exercise-result">
                                <h3>{result.exerciseName}</h3>

                                {#if result.targetReps > 0}
                                    <div class="reps-adjustment">
                                        <label for="reps-{index}">Actual Reps:</label>
                                        <input
                                            type="number"
                                            id="reps-{index}"
                                            bind:value={result.actualReps}
                                            min="0"
                                            max="100"
                                        />
                                        <span class="target-info">(Target: {result.targetReps})</span>
                                    </div>
                                {/if}

                                {#if result.targetDuration > 0}
                                    <div class="duration-adjustment">
                                        <label for="duration-{index}">Actual Duration (seconds):</label>
                                        <input
                                            type="number"
                                            id="duration-{index}"
                                            bind:value={result.actualDuration}
                                            min="0"
                                            max="3600"
                                        />
                                        <span class="target-info">(Target: {formatTime(result.targetDuration)})</span>
                                    </div>
                                {/if}

                                <div class="difficulty-rating">
                                    <label>Difficulty:</label>
                                    <DifficultyRating
                                        value={result.difficulty}
                                        on:change={(e) => result.difficulty = e.detail.value}
                                    />
                                </div>

                                <div class="notes-section">
                                    <label for="notes-{index}">Notes:</label>
                                    <textarea
                                        id="notes-{index}"
                                        bind:value={result.notes}
                                        placeholder="How did this exercise feel? Any adjustments needed?"
                                        rows="2"
                                    ></textarea>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="complete-actions">
                        <Button variant="primary" on:click={saveWorkoutResults}>
                            💾 Save Results
                        </Button>
                        <Button variant="secondary" href="/routines">
                            Back to Routines
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
                {@const currentExercise = getCurrentExercise()}
                <Card class="exercise-card">
                    <div class="exercise-header">
                        <h2>{currentExercise.exercise.name}</h2>
                        <p class="exercise-description">{currentExercise.exercise.description}</p>
                        <div class="exercise-meta">
                            <span class="meta-item">Exercise {currentExerciseIndex + 1} of {routine.exercises.length}</span>
                        </div>
                    </div>

                    <div class="exercise-content">
                        {#if currentExercise.template.type === 'time' || currentExercise.template.duration}
                            <!-- Time-based exercise -->
                            <div class="timer-section">
                                <Timer
                                    duration={currentExercise.template.time || currentExercise.template.duration || 30}
                                    autoStart={true}
                                    showControls={false}
                                    on:complete={handleTimerComplete}
                                />
                                {#if (currentExercise.template.sets || 1) > 1}
                                    <div class="sets-info">
                                        <span class="sets-label">Set {currentSetNumber} of {currentExercise.template.sets || 1}</span>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <!-- Rep-based exercise -->
                            <div class="reps-section">
                                <div class="reps-display">
                                    <span class="reps-number">{currentExercise.template.reps || 10}</span>
                                    <span class="reps-label">reps</span>
                                </div>
                                {#if (currentExercise.template.sets || 1) > 1}
                                    <div class="sets-info">
                                        <span class="sets-label">Set {currentSetNumber} of {currentExercise.template.sets || 1}</span>
                                    </div>
                                {/if}
                            </div>
                        {/if}

                        {#if currentExercise.template.weight}
                            <div class="weight-display">
                                <span class="weight-label">Weight:</span>
                                <span class="weight-value">{currentExercise.template.weight}</span>
                            </div>
                        {/if}

                        {#if currentExercise.template.bandStrength}
                            <div class="band-display">
                                <span class="band-label">Band:</span>
                                <span class="band-value">{currentExercise.template.bandStrength}</span>
                            </div>
                        {/if}
                    </div>

                    <div class="action-section">
                        <Button variant="success" size="large" fullWidth={true} on:click={handleDoneClick}>
                            ✅ Done
                        </Button>
                    </div>
                </Card>
            {/if}
        </div>
    {/if}
</main>

{#if showPrintView}
    <div class="print-view-overlay">
        <WorkoutPrintView
            {routine}
            showPrintButton={true}
            on:back={closePrintView}
        />
    </div>
{/if}

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
    .workout-complete,
    .error-state {
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
    .complete-content h1,
    .error-content h1 {
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

    /* Exercise Summary Styles */
    .exercise-summary {
        margin: 2rem 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .exercise-result {
        padding: 1.5rem;
        border: 2px solid var(--subtle);
        border-radius: 0.75rem;
        background-color: var(--background);
    }

    .exercise-result h3 {
        margin: 0 0 1rem 0;
        color: var(--primary);
        font-size: 1.25rem;
    }

    .reps-adjustment,
    .duration-adjustment,
    .difficulty-rating,
    .notes-section {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .reps-adjustment,
    .duration-adjustment {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .reps-adjustment label,
    .duration-adjustment label,
    .difficulty-rating label,
    .notes-section label {
        font-weight: 600;
        color: var(--primary);
        min-width: 120px;
    }

    .reps-adjustment input,
    .duration-adjustment input {
        padding: 0.5rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        width: 80px;
        text-align: center;
    }

    .target-info {
        color: var(--tertiary);
        font-size: 0.875rem;
        font-style: italic;
    }

    .notes-section textarea {
        padding: 0.75rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        font-family: inherit;
        resize: vertical;
        min-height: 60px;
    }

    .difficulty-rating {
        display: flex;
        align-items: center;
        gap: 1rem;
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

    .start-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        flex-wrap: wrap;
    }

    .sets-info {
        text-align: center;
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .sets-label {
        font-size: 0.875rem;
        color: var(--tertiary);
        font-weight: 500;
    }
</style>
