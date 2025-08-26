<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import ConfirmModal from '$lib/components/ConfirmModal.svelte';
    import AlertModal from '$lib/components/AlertModal.svelte';
    import ExerciseSelectorModal from '$lib/components/ExerciseSelectorModal.svelte';
    import ExerciseIcon from '$lib/components/ExerciseIcon.svelte';

    let saving = false;
    let showCancelModal = false;
    let showExerciseSelectorModal = false;
    let editingExerciseIndex = -1;

    // Alert modal state
    let showAlertModal = false;
    let alertTitle = '';
    let alertMessage = '';
    let alertVariant = 'info';

    // Form data
    let routineName = '';
    let routineDescription = '';
    let routineCategory = 'strength';
    let estimatedDuration = 30;
    let exercises = [];
    $: exerciseIds = exercises.map(e => e.id);

    const categories = [
        { value: 'strength', label: 'Strength Training' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'full_body', label: 'Full Body' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'yoga', label: 'Yoga' }
    ];

    function saveRoutine() {
        if (!routineName.trim()) {
            alertMessage = 'Please enter a routine name';
            alertTitle = 'Error';
            alertVariant = 'error';
            showAlertModal = true;
            return;
        }

        saving = true;

        // Simulate API call
        setTimeout(() => {
            saving = false;
            alertMessage = 'Routine created successfully!';
            alertTitle = 'Success';
            alertVariant = 'success';
            showAlertModal = true;
            window.location.href = '/routines';
        }, 1000);
    }

    function cancelCreate() {
        showCancelModal = true;
    }

    function addExercise() {
        showExerciseSelectorModal = true;
    }

    function handleAddExercises(event) {
        const newExercises = event.detail;
        exercises = [...exercises, ...newExercises];
    }

    function handleRemoveExercise(event) {
        const exerciseId = event.detail;
        exercises = exercises.filter(exercise => exercise.id !== exerciseId);
    }

    function moveExerciseUp(index) {
        if (index > 0) {
            const newExercises = [...exercises];
            [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
            exercises = newExercises;
        }
    }

    function moveExerciseDown(index) {
        if (index < exercises.length - 1) {
            const newExercises = [...exercises];
            [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
            exercises = newExercises;
        }
    }

    function toggleEditMode(index) {
        if (editingExerciseIndex === index) {
            editingExerciseIndex = -1; // Save and exit edit mode
        } else {
            editingExerciseIndex = index; // Enter edit mode
        }
    }

    function updateExerciseTemplate(index, field, value) {
        const newExercises = [...exercises];
        if (!newExercises[index].template) {
            newExercises[index].template = {};
        }
        newExercises[index].template[field] = value;
        exercises = newExercises;
    }

    function addRestPeriod(index) {
        const restExercise = {
            id: `rest-${Date.now()}`,
            name: 'Rest Period',
            description: 'Rest and recovery period',
            category: 'rest',
            template: {
                type: 'time',
                sets: 1,
                time: 60,
                restBetweenSets: 0,
                weight: '',
                notes: ''
            }
        };

        const newExercises = [...exercises];
        newExercises.splice(index + 1, 0, restExercise);
        exercises = newExercises;
    }
</script>

<Nav />

<main class="create-routine">
    <div class="create-header">
        <div class="create-title">
            <h1>Create New Routine</h1>
            <p>Build a custom workout routine from scratch</p>
        </div>
        <div class="create-actions">
            <Button variant="secondary" on:click={cancelCreate}>
                <ExerciseIcon category="default" size={16} /> Cancel
            </Button>
            <Button variant="primary" on:click={saveRoutine} disabled={saving}>
                {saving ? 'Creating...' : 'Create Routine'}
            </Button>
        </div>
    </div>

    <div class="create-content">
        <!-- Routine Details -->
        <Card class="routine-details">
            <h2>Routine Details</h2>
            <div class="form-grid">
                <div class="form-group">
                    <label for="routine-name">Routine Name *</label>
                    <input
                        id="routine-name"
                        type="text"
                        bind:value={routineName}
                        placeholder="Enter routine name"
                        class="form-input"
                        required
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
                <h2>Exercises ({exercises.length})</h2>
                <Button variant="primary" size="small" on:click={addExercise}>
                    <ExerciseIcon category="default" size={16} /> Add Exercise
                </Button>
            </div>

            {#if exercises.length === 0}
                <div class="empty-exercises">
                    <div class="empty-icon">
                    <ExerciseIcon category="strength" size={48} />
                </div>
                    <h3>No exercises yet</h3>
                    <p>Add exercises to your routine to get started</p>
                    <Button variant="primary" on:click={addExercise}>
                        <ExerciseIcon category="default" size={16} /> Add Your First Exercise
                    </Button>
                </div>
            {:else}
                <div class="exercises-list">
                    {#each exercises as exercise, index}
                        <div class="exercise-item">
                            <div class="exercise-order">
                                <span class="order-number">{index + 1}</span>
                            </div>
                            <div class="exercise-info">
                                <div class="exercise-name {exercise.category === 'rest' ? 'rest-exercise' : ''}">
                                    <ExerciseIcon
                                        category={exercise.category}
                                        exerciseName={exercise.name}
                                        size={20}
                                        class_name="exercise-icon"
                                    />
                                    {exercise.name}
                                </div>
                                {#if editingExerciseIndex === index}
                                    <div class="exercise-edit-form">
                                        <div class="edit-row">
                                            <label>Sets:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={exercise.template?.sets || 3}
                                                on:change={(e) => updateExerciseTemplate(index, 'sets', parseInt(e.target.value))}
                                                class="edit-input"
                                            />
                                        </div>
                                        <div class="edit-row">
                                            <label>Type:</label>
                                            <select
                                                value={exercise.template?.type || 'reps'}
                                                on:change={(e) => updateExerciseTemplate(index, 'type', e.target.value)}
                                                class="edit-select"
                                            >
                                                <option value="reps">Reps</option>
                                                <option value="time">Time (seconds)</option>
                                            </select>
                                        </div>
                                        <div class="edit-row">
                                            <label>{exercise.template?.type === 'time' ? 'Time:' : 'Reps:'}</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={exercise.template?.type === 'time' ? 600 : 100}
                                                value={exercise.template?.type === 'time' ? (exercise.template?.time || 30) : (exercise.template?.reps || 10)}
                                                on:change={(e) => updateExerciseTemplate(index, exercise.template?.type === 'time' ? 'time' : 'reps', parseInt(e.target.value))}
                                                class="edit-input"
                                            />
                                        </div>
                                        <div class="edit-row">
                                            <label>Weight:</label>
                                            <input
                                                type="text"
                                                value={exercise.template?.weight || ''}
                                                on:change={(e) => updateExerciseTemplate(index, 'weight', e.target.value)}
                                                placeholder="e.g., 50 lbs"
                                                class="edit-input"
                                            />
                                        </div>
                                    </div>
                                {:else}
                                    <div class="exercise-details">
                                        <span class="detail">{exercise.template?.sets || 3} sets × {exercise.template?.type === 'time' ? (exercise.template?.time || 30) + 's' : (exercise.template?.reps || 10) + ' reps'}</span>
                                        {#if exercise.template?.weight}
                                            <span class="detail">@ {exercise.template.weight}</span>
                                        {/if}
                                    </div>
                                {/if}
                            </div>

                            <div class="exercise-actions">
                                <div class="reorder-buttons">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        on:click={() => moveExerciseUp(index)}
                                        disabled={index === 0}
                                    >
                                        <ExerciseIcon category="arrow-up" size={16} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        on:click={() => moveExerciseDown(index)}
                                        disabled={index === exercises.length - 1}
                                    >
                                        <ExerciseIcon category="arrow-down" size={16} />
                                    </Button>
                                </div>
                                <Button
                                    variant={editingExerciseIndex === index ? "primary" : "secondary"}
                                    size="small"
                                    on:click={() => toggleEditMode(index)}
                                >
                                    {editingExerciseIndex === index ? 'Save' : 'Edit'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    on:click={() => addRestPeriod(index)}
                                >
                                    <ExerciseIcon category="rest" size={16} /> Add Rest
                                </Button>
                                <Button
                                    variant="danger"
                                    size="small"
                                    on:click={() => exercises = exercises.filter((_, i) => i !== index)}
                                >
                                    <ExerciseIcon category="default" size={16} /> Remove
                                </Button>
                            </div>
                        </div>
                    {/each}
                </div>

                {#if exercises.length > 0}
                    <div class="exercises-actions">
                        <Button variant="secondary" size="small" on:click={() => addRestPeriod(exercises.length - 1)}>
                            <ExerciseIcon category="rest" size={16} /> Add Rest Period
                        </Button>
                    </div>
                {/if}
            {/if}
        </Card>

        <!-- Tips -->
        <Card class="tips-section">
            <h2><ExerciseIcon category="default" size={24} /> Tips for Creating a Great Routine</h2>
            <div class="tips-list">
                <div class="tip">
                    <h4><ExerciseIcon category="target" size={20} /> Start Simple</h4>
                    <p>Begin with 3-5 exercises and gradually add more as you get comfortable.</p>
                </div>
                <div class="tip">
                    <h4><ExerciseIcon category="default" size={20} /> Consider Time</h4>
                    <p>Plan for realistic workout durations that fit your schedule.</p>
                </div>
                <div class="tip">
                    <h4><ExerciseIcon category="default" size={20} /> Mix It Up</h4>
                    <p>Include a variety of exercises targeting different muscle groups.</p>
                </div>
                <div class="tip">
                    <h4><ExerciseIcon category="default" size={20} /> Progressive Overload</h4>
                    <p>Start with manageable weights and reps, then gradually increase difficulty.</p>
                </div>
            </div>
        </Card>
    </div>

    {#if showCancelModal}
        <ConfirmModal
            bind:isOpen={showCancelModal}
            title="Confirm Cancellation"
            message="Are you sure you want to cancel creating this routine? Any unsaved changes will be lost."
            variant="warning"
            confirmText="Cancel Creation"
            cancelText="Keep Creating"
            on:confirm={() => {
                window.location.href = '/routines';
            }}
            on:cancel={() => (showCancelModal = false)}
        />
    {/if}

    {#if showAlertModal}
        <AlertModal
            bind:isOpen={showAlertModal}
            title={alertTitle}
            message={alertMessage}
            variant={alertVariant}
            on:close={() => (showAlertModal = false)}
        />
    {/if}

    <!-- Exercise Selector Modal -->
    <ExerciseSelectorModal
        bind:isOpen={showExerciseSelectorModal}
        existingExercises={exerciseIds}
        on:addExercises={handleAddExercises}
        on:removeExercise={handleRemoveExercise}
    />
</main>

<style>
    .create-routine {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    .create-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .create-title h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .create-title p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .create-actions {
        display: flex;
        gap: 1rem;
    }

    .create-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .routine-details h2,
    .exercises-section h2,
    .tips-section h2 {
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

    .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .empty-exercises h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .empty-exercises p {
        margin: 0 0 1.5rem 0;
        font-size: 1rem;
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

    .exercise-order {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        background-color: var(--primary-light);
        color: var(--primary);
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .exercise-info {
        flex: 1;
    }

    .exercise-name {
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .exercise-icon {
        color: var(--primary);
        flex-shrink: 0;
    }

    .exercise-name.rest-exercise {
        color: var(--tertiary);
    }

    .exercise-edit-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .edit-row {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .edit-row label {
        font-weight: 600;
        color: var(--primary);
        font-size: 0.875rem;
    }

    .edit-input,
    .edit-select {
        padding: 0.5rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 0.875rem;
        transition: border-color 0.2s ease;
        font-family: inherit;
    }

    .edit-input:focus,
    .edit-select:focus {
        outline: none;
        border-color: var(--primary);
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

    .reorder-buttons {
        display: flex;
        gap: 0.25rem;
        flex-shrink: 0;
    }

    .tips-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .tip {
        padding: 1rem;
        background-color: var(--amber-50);
        border-radius: 0.5rem;
        border-left: 4px solid var(--amber-500);
    }

    .tip h4 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .tip p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .create-routine {
            padding: 1rem;
        }

        .create-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .create-title h1 {
            font-size: 2rem;
        }

        .create-actions {
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

        .tips-list {
            grid-template-columns: 1fr;
        }
    }
</style>
