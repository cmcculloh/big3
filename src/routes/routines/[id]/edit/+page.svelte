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
    let saving = false;

    // Form data
    let routineName = '';
    let routineDescription = '';
    let routineCategory = 'strength';
    let estimatedDuration = 30;

    // Mock routine data - will be replaced with actual API call
    const mockRoutine = {
        id: routineId,
        name: 'Upper Body Strength',
        description: 'Focus on chest, back, and arms',
        category: 'strength',
        estimatedDuration: 45,
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

    const categories = [
        { value: 'strength', label: 'Strength Training' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'full_body', label: 'Full Body' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'yoga', label: 'Yoga' }
    ];

    onMount(() => {
        // Simulate API call
        setTimeout(() => {
            routine = mockRoutine;
            // Populate form with existing data
            routineName = routine.name;
            routineDescription = routine.description;
            routineCategory = routine.category;
            estimatedDuration = routine.estimatedDuration;
            loading = false;
        }, 500);
    });

    function saveRoutine() {
        saving = true;

        // Simulate API call
        setTimeout(() => {
            saving = false;
            alert('Routine saved successfully!');
            window.location.href = '/routines';
        }, 1000);
    }

    function cancelEdit() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = '/routines';
        }
    }

    function removeExercise(exerciseId) {
        if (confirm('Are you sure you want to remove this exercise from the routine?')) {
            routine.exercises = routine.exercises.filter(ex => ex.id !== exerciseId);
        }
    }

    function addExercise() {
        // This would open a modal to select exercises
        alert('Add exercise functionality would be implemented here');
    }

    function moveExercise(index, direction) {
        if (direction === 'up' && index > 0) {
            const temp = routine.exercises[index];
            routine.exercises[index] = routine.exercises[index - 1];
            routine.exercises[index - 1] = temp;
        } else if (direction === 'down' && index < routine.exercises.length - 1) {
            const temp = routine.exercises[index];
            routine.exercises[index] = routine.exercises[index + 1];
            routine.exercises[index + 1] = temp;
        }
    }
</script>

<Nav />

<main class="edit-routine">
    <div class="edit-header">
        <div class="edit-title">
            <h1>Edit Routine</h1>
            <p>Modify your workout routine settings and exercises</p>
        </div>
        <div class="edit-actions">
            <Button variant="secondary" on:click={cancelEdit}>
                ❌ Cancel
            </Button>
            <Button variant="primary" on:click={saveRoutine} disabled={saving}>
                {saving ? '💾 Saving...' : '💾 Save Routine'}
            </Button>
        </div>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading routine...</p>
        </div>
    {:else}
        <div class="edit-content">
            <!-- Routine Details -->
            <Card class="routine-details">
                <h2>Routine Details</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="routine-name">Routine Name</label>
                        <input
                            id="routine-name"
                            type="text"
                            bind:value={routineName}
                            placeholder="Enter routine name"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label for="routine-category">Category</label>
                        <select id="routine-category" bind:value={routineCategory} class="form-select">
                            {#each categories as category}
                                <option value={category.value}>{category.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="routine-duration">Estimated Duration (minutes)</label>
                        <input
                            id="routine-duration"
                            type="number"
                            bind:value={estimatedDuration}
                            min="5"
                            max="180"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group full-width">
                        <label for="routine-description">Description</label>
                        <textarea
                            id="routine-description"
                            bind:value={routineDescription}
                            placeholder="Describe your routine..."
                            rows="3"
                            class="form-textarea"
                        ></textarea>
                    </div>
                </div>
            </Card>

            <!-- Exercises -->
            <Card class="exercises-section">
                <div class="exercises-header">
                    <h2>Exercises ({routine.exercises.length})</h2>
                    <Button variant="primary" size="small" on:click={addExercise}>
                        ➕ Add Exercise
                    </Button>
                </div>

                {#if routine.exercises.length === 0}
                    <div class="empty-exercises">
                        <p>No exercises in this routine yet.</p>
                        <Button variant="primary" on:click={addExercise}>
                            Add Your First Exercise
                        </Button>
                    </div>
                {:else}
                    <div class="exercises-list">
                        {#each routine.exercises as exercise, index}
                            <div class="exercise-item">
                                <div class="exercise-info">
                                    <div class="exercise-name">{exercise.exercise.name}</div>
                                    <div class="exercise-details">
                                        {#if exercise.template.reps}
                                            <span class="detail">{exercise.template.sets} sets × {exercise.template.reps} reps</span>
                                        {:else}
                                            <span class="detail">{exercise.template.sets} sets × {exercise.template.duration}s</span>
                                        {/if}
                                        {#if exercise.template.weight}
                                            <span class="detail">@ {exercise.template.weight} lbs</span>
                                        {/if}
                                        {#if exercise.template.bandStrength}
                                            <span class="detail">@ {exercise.template.bandStrength} band</span>
                                        {/if}
                                    </div>
                                </div>

                                <div class="exercise-actions">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        on:click={() => moveExercise(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        ⬆️
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        on:click={() => moveExercise(index, 'down')}
                                        disabled={index === routine.exercises.length - 1}
                                    >
                                        ⬇️
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        on:click={() => removeExercise(exercise.id)}
                                    >
                                        ✏️ Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="small"
                                        on:click={() => removeExercise(exercise.id)}
                                    >
                                        🗑️ Remove
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </Card>
        </div>
    {/if}
</main>

<style>
    .edit-routine {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    .edit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .edit-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .edit-title p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .edit-actions {
        display: flex;
        gap: 1rem;
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

    .edit-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .routine-details h2,
    .exercises-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        color: var(--primary);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        font-weight: 600;
        color: var(--primary);
        font-size: 0.875rem;
    }

    .form-input,
    .form-select,
    .form-textarea {
        padding: 0.75rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s ease;
        font-family: inherit;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
        outline: none;
        border-color: var(--primary);
    }

    .form-textarea {
        resize: vertical;
        min-height: 80px;
    }

    .exercises-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .empty-exercises {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--tertiary);
    }

    .empty-exercises p {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
    }

    .exercises-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .exercise-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
        gap: 1rem;
    }

    .exercise-info {
        flex: 1;
    }

    .exercise-name {
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 0.25rem;
    }

    .exercise-details {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .detail {
        font-size: 0.875rem;
        color: var(--tertiary);
        background-color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
    }

    .exercise-actions {
        display: flex;
        gap: 0.25rem;
        flex-shrink: 0;
    }

    @media (max-width: 768px) {
        .edit-routine {
            padding: 1rem;
        }

        .edit-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .edit-title h1 {
            font-size: 2rem;
        }

        .edit-actions {
            justify-content: center;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }

        .exercises-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }

        .exercise-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }

        .exercise-actions {
            justify-content: center;
        }
    }
</style>
