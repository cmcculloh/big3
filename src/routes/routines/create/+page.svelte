<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';

    let saving = false;

    // Form data
    let routineName = '';
    let routineDescription = '';
    let routineCategory = 'strength';
    let estimatedDuration = 30;
    let exercises = [];

    const categories = [
        { value: 'strength', label: 'Strength Training' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'full_body', label: 'Full Body' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'yoga', label: 'Yoga' }
    ];

    function saveRoutine() {
        if (!routineName.trim()) {
            alert('Please enter a routine name');
            return;
        }

        saving = true;

        // Simulate API call
        setTimeout(() => {
            saving = false;
            alert('Routine created successfully!');
            window.location.href = '/routines';
        }, 1000);
    }

    function cancelCreate() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = '/routines';
        }
    }

    function addExercise() {
        // This would open a modal to select exercises
        alert('Add exercise functionality would be implemented here');
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
                ❌ Cancel
            </Button>
            <Button variant="primary" on:click={saveRoutine} disabled={saving}>
                {saving ? '💾 Creating...' : '💾 Create Routine'}
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
                    ➕ Add Exercise
                </Button>
            </div>

            {#if exercises.length === 0}
                <div class="empty-exercises">
                    <div class="empty-icon">🏋️</div>
                    <h3>No exercises yet</h3>
                    <p>Add exercises to your routine to get started</p>
                    <Button variant="primary" on:click={addExercise}>
                        Add Your First Exercise
                    </Button>
                </div>
            {:else}
                <div class="exercises-list">
                    {#each exercises as exercise, index}
                        <div class="exercise-item">
                            <div class="exercise-info">
                                <div class="exercise-name">{exercise.name}</div>
                                <div class="exercise-details">
                                    <span class="detail">{exercise.sets} sets × {exercise.reps || exercise.duration}s</span>
                                    {#if exercise.weight}
                                        <span class="detail">@ {exercise.weight} lbs</span>
                                    {/if}
                                </div>
                            </div>

                            <div class="exercise-actions">
                                <Button
                                    variant="danger"
                                    size="small"
                                    on:click={() => exercises = exercises.filter((_, i) => i !== index)}
                                >
                                    🗑️ Remove
                                </Button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </Card>

        <!-- Tips -->
        <Card class="tips-section">
            <h2>💡 Tips for Creating a Great Routine</h2>
            <div class="tips-list">
                <div class="tip">
                    <h4>🎯 Start Simple</h4>
                    <p>Begin with 3-5 exercises and gradually add more as you get comfortable.</p>
                </div>
                <div class="tip">
                    <h4>⏱️ Consider Time</h4>
                    <p>Plan for realistic workout durations that fit your schedule.</p>
                </div>
                <div class="tip">
                    <h4>🔄 Mix It Up</h4>
                    <p>Include a variety of exercises targeting different muscle groups.</p>
                </div>
                <div class="tip">
                    <h4>📈 Progressive Overload</h4>
                    <p>Start with manageable weights and reps, then gradually increase difficulty.</p>
                </div>
            </div>
        </Card>
    </div>
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

    .tips-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .tip {
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
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
