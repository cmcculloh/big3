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
    let exerciseEquipment = 'bodyweight';
    let exerciseInstructions = '';
    let exerciseSafetyTips = '';
    let exerciseTargetMuscles = '';
    let nameError = '';

    // Workout-specific fields
    let exerciseType = 'reps'; // 'reps' or 'time'
    let exerciseSets = 3;
    let exerciseReps = 10;
    let exerciseTime = 30; // seconds
    let exerciseRestBetweenSets = 60; // seconds
    let exerciseWeight = '';
    let exerciseNotes = '';

    // AI generation
    let isGenerating = false;
    let aiDescription = '';
    let aiEquipment = '';
    let aiTargetMuscles = '';
    let aiDifficulty = 'beginner';
    let showAITab = false;

    // Categories and equipment options
    const categories = [
        { value: 'strength', label: 'Strength' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'balance', label: 'Balance' },
        { value: 'sports', label: 'Sports' }
    ];

    const equipmentTypes = [
        { value: 'bodyweight', label: 'Bodyweight' },
        { value: 'dumbbells', label: 'Dumbbells' },
        { value: 'resistance_bands', label: 'Resistance Bands' },
        { value: 'barbell', label: 'Barbell' },
        { value: 'kettlebell', label: 'Kettlebell' },
        { value: 'cardio_machine', label: 'Cardio Machine' }
    ];

    const difficultyLevels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

    // Initialize form when exercise changes
    $: if (exercise && isOpen) {
        // Handle both old structure (exercise.name) and new structure (exercise.exercise.name)
        exerciseName = exercise.exercise?.name || exercise.name || '';
        exerciseDescription = exercise.exercise?.description || exercise.description || '';
        exerciseCategory = exercise.exercise?.category || exercise.category || 'strength';
        exerciseEquipment = exercise.exercise?.equipment || exercise.equipment || 'bodyweight';
        exerciseInstructions = exercise.exercise?.instructions || exercise.instructions || '';
        exerciseSafetyTips = exercise.exercise?.safetyTips || exercise.safetyTips || '';
        exerciseTargetMuscles = exercise.exercise?.targetMuscles || exercise.targetMuscles || '';

        // Handle workout-specific fields from template
        exerciseType = exercise.template?.type || exercise.type || 'reps';
        exerciseSets = exercise.template?.sets || exercise.sets || 3;
        exerciseReps = exercise.template?.reps || exercise.reps || 10;
        exerciseTime = exercise.template?.time || exercise.time || 30;
        exerciseRestBetweenSets = exercise.template?.restBetweenSets || exercise.restBetweenSets || 60;
        exerciseWeight = exercise.template?.weight || exercise.weight || '';
        exerciseNotes = exercise.template?.notes || exercise.notes || '';

        console.log('=== POPULATING EDIT FORM ===');
        console.log('Exercise data received:', exercise);
        console.log('Exercise name set to:', exerciseName);
        console.log('Exercise template:', exercise.template);
    }

    // Reset form when opening for new exercise
    $: if (!exercise && isOpen) {
        exerciseName = '';
        exerciseDescription = '';
        exerciseCategory = 'strength';
        exerciseEquipment = 'bodyweight';
        exerciseInstructions = '';
        exerciseSafetyTips = '';
        exerciseTargetMuscles = '';
        exerciseType = 'reps';
        exerciseSets = 3;
        exerciseReps = 10;
        exerciseTime = 30;
        exerciseRestBetweenSets = 60;
        exerciseWeight = '';
        exerciseNotes = '';
        aiDescription = '';
        aiEquipment = '';
        aiTargetMuscles = '';
        aiDifficulty = 'beginner';
        showAITab = false;
    }

    async function generateWithAI() {
        if (!aiDescription.trim()) {
            return;
        }

        isGenerating = true;
        try {
            const response = await fetch('/api/exercises/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: aiDescription,
                    equipment: aiEquipment || undefined,
                    targetMuscles: aiTargetMuscles || undefined,
                    difficulty: aiDifficulty
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate exercise');
            }

            const aiExercise = await response.json();

            // Populate form with AI-generated data
            exerciseName = aiExercise.name || '';
            exerciseDescription = aiExercise.description || '';
            exerciseCategory = aiExercise.category || 'strength';
            exerciseEquipment = aiExercise.equipment || 'bodyweight';
            exerciseInstructions = aiExercise.instructions || '';
            exerciseSafetyTips = aiExercise.safetyTips || '';
            exerciseTargetMuscles = aiExercise.targetMuscles || '';

            // Switch to manual tab to show the generated data
            showAITab = false;

        } catch (error) {
            console.error('Error generating exercise:', error);
            alert('Failed to generate exercise. Please try again.');
        } finally {
            isGenerating = false;
        }
    }

    function handleSubmit() {
        if (!exerciseName.trim()) {
            nameError = 'Exercise name is required';
            return;
        }

        const exerciseData = {
            name: exerciseName.trim(),
            description: exerciseDescription.trim(),
            category: exerciseCategory,
            equipment: exerciseEquipment,
            instructions: exerciseInstructions.trim(),
            safetyTips: exerciseSafetyTips.trim(),
            targetMuscles: exerciseTargetMuscles.trim(),
            // Workout-specific data
            type: exerciseType,
            sets: exerciseSets,
            reps: exerciseReps,
            time: exerciseTime,
            restBetweenSets: exerciseRestBetweenSets,
            weight: exerciseWeight.trim(),
            notes: exerciseNotes.trim()
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

            <!-- Tab Navigation -->
            <div class="tab-navigation">
                <button
                    class="tab-button"
                    class:active={!showAITab}
                    on:click={() => showAITab = false}
                >
                    ✏️ Manual Entry
                </button>
                <button
                    class="tab-button"
                    class:active={showAITab}
                    on:click={() => showAITab = true}
                >
                    🤖 AI Generation
                </button>
            </div>

            <div class="modal-body">
                {#if !showAITab}
                    <!-- Manual Entry Tab -->
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label for="exercise-name">Exercise Name *</label>
                            <input
                                id="exercise-name"
                                type="text"
                                bind:value={exerciseName}
                                placeholder="e.g., Push-ups, Dumbbell Rows"
                                class="form-input"
                                required
                                on:input={() => nameError = ''}
                            />
                            {#if nameError}
                                <p class="error-message">{nameError}</p>
                            {/if}
                        </div>

                        <div class="form-group full-width">
                            <label for="exercise-description">Description</label>
                            <textarea
                                id="exercise-description"
                                bind:value={exerciseDescription}
                                placeholder="Brief description of the exercise"
                                class="form-textarea"
                                rows="2"
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
                            <label for="exercise-equipment">Equipment</label>
                            <select id="exercise-equipment" bind:value={exerciseEquipment} class="form-select">
                                {#each equipmentTypes as equipment}
                                    <option value={equipment.value}>{equipment.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group full-width">
                            <label for="exercise-instructions">Instructions</label>
                            <textarea
                                id="exercise-instructions"
                                bind:value={exerciseInstructions}
                                placeholder="Step-by-step instructions for proper form"
                                class="form-textarea"
                                rows="4"
                            ></textarea>
                        </div>

                        <div class="form-group full-width">
                            <label for="exercise-safety">Safety Tips</label>
                            <textarea
                                id="exercise-safety"
                                bind:value={exerciseSafetyTips}
                                placeholder="Important safety considerations and modifications"
                                class="form-textarea"
                                rows="3"
                            ></textarea>
                        </div>

                        <div class="form-group full-width">
                            <label for="exercise-targets">Target Muscles</label>
                            <textarea
                                id="exercise-targets"
                                bind:value={exerciseTargetMuscles}
                                placeholder="Primary and secondary muscle groups targeted"
                                class="form-textarea"
                                rows="2"
                            ></textarea>
                        </div>

                        <!-- Workout-specific fields -->
                        <div class="form-group">
                            <label for="exercise-type">Exercise Type</label>
                            <select id="exercise-type" bind:value={exerciseType} class="form-select">
                                <option value="reps">Reps-based</option>
                                <option value="time">Time-based</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="exercise-sets">Sets</label>
                            <input
                                id="exercise-sets"
                                type="number"
                                bind:value={exerciseSets}
                                min="1"
                                max="20"
                                class="form-input"
                            />
                        </div>

                        {#if exerciseType === 'reps'}
                            <div class="form-group">
                                <label for="exercise-reps">Reps per Set</label>
                                <input
                                    id="exercise-reps"
                                    type="number"
                                    bind:value={exerciseReps}
                                    min="1"
                                    max="100"
                                    class="form-input"
                                />
                            </div>
                        {:else}
                            <div class="form-group">
                                <label for="exercise-time">Time per Set (seconds)</label>
                                <input
                                    id="exercise-time"
                                    type="number"
                                    bind:value={exerciseTime}
                                    min="5"
                                    max="600"
                                    class="form-input"
                                />
                            </div>
                        {/if}

                        <div class="form-group">
                            <label for="exercise-rest">Rest Between Sets (seconds)</label>
                            <input
                                id="exercise-rest"
                                type="number"
                                bind:value={exerciseRestBetweenSets}
                                min="0"
                                max="300"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label for="exercise-weight">Weight (optional)</label>
                            <input
                                id="exercise-weight"
                                type="text"
                                bind:value={exerciseWeight}
                                placeholder="e.g., 50 lbs, 25 kg"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group full-width">
                            <label for="exercise-notes">Notes</label>
                            <textarea
                                id="exercise-notes"
                                bind:value={exerciseNotes}
                                placeholder="Any additional notes or modifications"
                                class="form-textarea"
                                rows="2"
                            ></textarea>
                        </div>
                    </div>
                {:else}
                    <!-- AI Generation Tab -->
                    <div class="ai-form">
                        <div class="ai-description">
                            <p class="ai-intro">
                                Tell the AI what kind of exercise you need. Be specific about:
                            </p>
                            <ul class="ai-tips">
                                <li>What you want to target (muscles, fitness goals)</li>
                                <li>Equipment you have available</li>
                                <li>Your fitness level</li>
                                <li>Any specific requirements or limitations</li>
                            </ul>
                        </div>

                        <div class="form-group full-width">
                            <label for="ai-description">Exercise Description *</label>
                            <textarea
                                id="ai-description"
                                bind:value={aiDescription}
                                placeholder="e.g., 'I need an exercise that targets my upper back. I have dumbbells and want something for beginners.'"
                                class="form-textarea"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label for="ai-equipment">Available Equipment</label>
                            <select id="ai-equipment" bind:value={aiEquipment} class="form-select">
                                <option value="">Any equipment</option>
                                {#each equipmentTypes as equipment}
                                    <option value={equipment.value}>{equipment.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="ai-difficulty">Difficulty Level</label>
                            <select id="ai-difficulty" bind:value={aiDifficulty} class="form-select">
                                {#each difficultyLevels as difficulty}
                                    <option value={difficulty.value}>{difficulty.label}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group full-width">
                            <label for="ai-targets">Target Muscles (Optional)</label>
                            <input
                                id="ai-targets"
                                type="text"
                                bind:value={aiTargetMuscles}
                                placeholder="e.g., upper back, shoulders, core"
                                class="form-input"
                            />
                        </div>

                        <div class="ai-actions">
                            <Button
                                variant="primary"
                                on:click={generateWithAI}
                                disabled={isGenerating || !aiDescription.trim()}
                            >
                                {isGenerating ? '🤖 Generating...' : '🤖 Generate Exercise'}
                            </Button>
                        </div>
                    </div>
                {/if}
            </div>

            <div class="modal-actions">
                <Button variant="secondary" on:click={handleCancel}>
                    Cancel
                </Button>
                {#if !showAITab}
                    <Button variant="primary" on:click={handleSubmit}>
                        {isEditing ? 'Update Exercise' : 'Add Exercise'}
                    </Button>
                {/if}
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
        max-width: 700px;
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
        color: var(--primary);
    }

    .tab-navigation {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid var(--subtle);
    }

    .tab-button {
        padding: 0.75rem 1.5rem;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        color: var(--tertiary);
        border-bottom: 3px solid transparent;
        transition: all 0.2s ease;
    }

    .tab-button:hover {
        color: var(--primary);
    }

    .tab-button.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
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
        color: var(--primary);
    }

    .form-input, .form-select, .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--subtle);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(10, 36, 99, 0.1);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .error-message {
        color: var(--secondary);
        font-size: 0.875rem;
        margin-top: 0.5rem;
    }

    .ai-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .ai-description {
        background: var(--subtle);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .ai-intro {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
        color: var(--primary);
    }

    .ai-tips {
        margin: 0;
        padding-left: 1.5rem;
        color: var(--tertiary);
    }

    .ai-tips li {
        margin-bottom: 0.25rem;
    }

    .ai-actions {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
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

        .tab-navigation {
            flex-direction: column;
        }

        .tab-button {
            text-align: left;
        }
    }
</style>
