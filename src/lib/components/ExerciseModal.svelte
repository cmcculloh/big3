<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';

    export let isOpen = false;
    export let exercise = null; // null for new, exercise object for edit
    export let isEditing = false;

    const dispatch = createEventDispatcher();

    // Form data
    let exerciseName = '';
    let exerciseDescription = '';
    let exerciseCategory = 'strength';
    let sets = 3;
    let reps = 10;
    let duration = null;
    let weight = null;
    let bandStrength = null;
    let restBetweenSets = 60;
    let notes = '';

    // Categories and equipment options
    const categories = [
        { value: 'strength', label: 'Strength' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'warmup', label: 'Warm-up' },
        { value: 'cooldown', label: 'Cool-down' }
    ];

    const bandStrengths = [
        { value: 'light', label: 'Light' },
        { value: 'medium', label: 'Medium' },
        { value: 'heavy', label: 'Heavy' }
    ];

    // Initialize form when exercise changes
    $: if (exercise && isOpen) {
        exerciseName = exercise.name || '';
        exerciseDescription = exercise.description || '';
        exerciseCategory = exercise.category || 'strength';
        sets = exercise.sets || 3;
        reps = exercise.reps || 10;
        duration = exercise.duration || null;
        weight = exercise.weight || null;
        bandStrength = exercise.bandStrength || null;
        restBetweenSets = exercise.restBetweenSets || 60;
        notes = exercise.notes || '';
    }

    // Reset form when opening for new exercise
    $: if (!exercise && isOpen) {
        exerciseName = '';
        exerciseDescription = '';
        exerciseCategory = 'strength';
        sets = 3;
        reps = 10;
        duration = null;
        weight = null;
        bandStrength = null;
        restBetweenSets = 60;
        notes = '';
    }

    function handleSubmit() {
        if (!exerciseName.trim()) {
            alert('Exercise name is required');
            return;
        }

        const exerciseData = {
            name: exerciseName.trim(),
            description: exerciseDescription.trim(),
            category: exerciseCategory,
            sets: parseInt(sets),
            reps: duration ? null : parseInt(reps),
            duration: duration ? parseInt(duration) : null,
            weight: weight ? parseFloat(weight) : null,
            bandStrength: bandStrength || null,
            restBetweenSets: parseInt(restBetweenSets),
            notes: notes.trim()
        };

        dispatch('save', exerciseData);
        isOpen = false;
    }

    function handleCancel() {
        dispatch('cancel');
        isOpen = false;
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleCancel();
        }
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleCancel();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div class="modal-backdrop" on:click={handleBackdropClick}>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">
                    {isEditing ? '✏️ Edit Exercise' : '➕ Add Exercise'}
                </h3>
            </div>

            <div class="modal-body">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="exercise-name">Exercise Name *</label>
                        <input
                            id="exercise-name"
                            type="text"
                            bind:value={exerciseName}
                            placeholder="e.g., Push-ups, Squats"
                            class="form-input"
                            required
                        />
                    </div>

                    <div class="form-group full-width">
                        <label for="exercise-description">Description</label>
                        <textarea
                            id="exercise-description"
                            bind:value={exerciseDescription}
                            placeholder="How to perform this exercise"
                            class="form-textarea"
                            rows="3"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="exercise-category">Category</label>
                        <select id="exercise-category" bind:value={exerciseCategory} class="form-select">
                            {#each categories as category}
                                <option value={category.value}>{category.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="exercise-sets">Sets</label>
                        <input
                            id="exercise-sets"
                            type="number"
                            bind:value={sets}
                            min="1"
                            max="20"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label for="exercise-reps">Reps</label>
                        <input
                            id="exercise-reps"
                            type="number"
                            bind:value={reps}
                            min="1"
                            max="100"
                            class="form-input"
                            disabled={!!duration}
                        />
                    </div>

                    <div class="form-group">
                        <label for="exercise-duration">Duration (seconds)</label>
                        <input
                            id="exercise-duration"
                            type="number"
                            bind:value={duration}
                            min="10"
                            max="600"
                            class="form-input"
                            disabled={!!reps}
                        />
                    </div>

                    <div class="form-group">
                        <label for="exercise-weight">Weight (lbs)</label>
                        <input
                            id="exercise-weight"
                            type="number"
                            bind:value={weight}
                            min="0"
                            step="0.5"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label for="exercise-band">Band Strength</label>
                        <select id="exercise-band" bind:value={bandStrength} class="form-select">
                            <option value={null}>None</option>
                            {#each bandStrengths as band}
                                <option value={band.value}>{band.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="exercise-rest">Rest Between Sets (seconds)</label>
                        <input
                            id="exercise-rest"
                            type="number"
                            bind:value={restBetweenSets}
                            min="0"
                            max="300"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group full-width">
                        <label for="exercise-notes">Notes</label>
                        <textarea
                            id="exercise-notes"
                            bind:value={notes}
                            placeholder="Form tips, modifications, etc."
                            class="form-textarea"
                            rows="2"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <Button variant="secondary" on:click={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" on:click={handleSubmit}>
                    {isEditing ? 'Update Exercise' : 'Add Exercise'}
                </Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    }

    .modal-header {
        margin-bottom: 1.5rem;
    }

    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .modal-body {
        margin-bottom: 2rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input:disabled {
        background-color: var(--bg-secondary);
        color: var(--text-secondary);
        cursor: not-allowed;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (max-width: 640px) {
        .form-grid {
            grid-template-columns: 1fr;
        }

        .modal-content {
            padding: 1.5rem;
            margin: 1rem;
        }

        .modal-actions {
            flex-direction: column;
        }

        .modal-actions .btn {
            width: 100%;
        }
    }
</style>
