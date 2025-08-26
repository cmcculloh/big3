<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';
    import Card from './Card.svelte';
    import AddExerciseModal from './AddExerciseModal.svelte';
    import ExerciseIcon from './ExerciseIcon.svelte';
    import { onMount } from 'svelte';

    export let isOpen = false;
    export let existingExercises = []; // Array of exercise IDs already in routine

    // Local copy that we can modify
    let localExistingExercises = [];
    let localExercisesVersion = 0; // Force reactivity

    const dispatch = createEventDispatcher();

    let exercises = [];
    let filteredExercises = [];
    let loading = true;
    let searchQuery = '';
    let selectedCategory = 'all';
    let selectedEquipment = 'all';



    // Modal state
    let showAddExerciseModal = false;
    let newExerciseData = null;

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'strength', label: 'Strength' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'yoga', label: 'Yoga' },
        { value: 'full_body', label: 'Full Body' }
    ];

    const equipmentTypes = [
        { value: 'all', label: 'All Equipment' },
        { value: 'bodyweight', label: 'Bodyweight' },
        { value: 'dumbbell', label: 'Dumbbells' },
        { value: 'resistance_band', label: 'Resistance Bands' },
        { value: 'barbell', label: 'Barbell' },
        { value: 'kettlebell', label: 'Kettlebell' },
        { value: 'machine', label: 'Cardio Machine' }
    ];

    async function fetchExercises() {
        try {
            loading = true;
            const response = await fetch('/api/exercises');
            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }
            exercises = await response.json();
            filteredExercises = exercises;
        } catch (error) {
            console.error('Error fetching exercises:', error);
            exercises = [];
            filteredExercises = [];
        } finally {
            loading = false;
        }
    }

    // Filter exercises based on search and filters
    $: {
        filteredExercises = exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (exercise.description && exercise.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
            const matchesEquipment = selectedEquipment === 'all' ||
                                   (exercise.equipment && exercise.equipment.type === selectedEquipment);

            return matchesSearch && matchesCategory && matchesEquipment;
        });
    }

    // Force re-evaluation of exercise states when localExistingExercises changes
    $: exerciseStates = filteredExercises.map(exercise => ({
        ...exercise,
        isInRoutine: localExistingExercises.includes(exercise.id)
    }));

    function getCategoryIcon(category) {
        return category;
    }

    function getEquipmentIcon(equipmentType) {
        return equipmentType;
    }

    function isExerciseAlreadyInRoutine(exerciseId) {
        return localExistingExercises.includes(exerciseId);
    }

    function removeFromRoutine(exerciseId) {
        dispatch('removeExercise', exerciseId);

        // Update the local array to immediately change button state
        localExistingExercises = localExistingExercises.filter(id => id !== exerciseId);
        localExercisesVersion++; // Force reactivity
    }

    function addToRoutine(exerciseId) {
        const exercise = exercises.find(e => e.id === exerciseId);
        const exerciseObject = {
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            category: exercise.category,
            equipment: exercise.equipment,
            instructions: exercise.instructions,
            safetyTips: exercise.safetyTips,
            targetMuscles: exercise.targetMuscles,
            // Default workout template
            template: {
                type: 'reps',
                sets: 3,
                reps: 10,
                time: 30,
                restBetweenSets: 60,
                weight: '',
                notes: ''
            }
        };
        dispatch('addExercises', [exerciseObject]);

        // Update the local array to immediately change button state
        localExistingExercises = [...localExistingExercises, exerciseId];
        localExercisesVersion++; // Force reactivity
    }

    function closeModal() {
        isOpen = false;
        searchQuery = '';
        selectedCategory = 'all';
        selectedEquipment = 'all';
    }

    function handleCreateExercise(exerciseData) {
        newExerciseData = exerciseData;
        // After creating, refresh the exercises list
        fetchExercises();
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    onMount(() => {
        // Only fetch exercises once when component mounts
        fetchExercises();
    });

    // Properly sync with parent's existingExercises prop whenever it changes
    $: if (isOpen && existingExercises) {
        localExistingExercises = [...existingExercises];
        localExercisesVersion++; // Force reactivity
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div class="modal-backdrop" on:click={handleBackdropClick}>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">➕ Add Exercises to Routine</h3>
            </div>

            <!-- Search and Filters -->
            <div class="filters">
                <div class="search-box">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        bind:value={searchQuery}
                        class="search-input"
                    />
                </div>

                <div class="filter-controls">
                    <select bind:value={selectedCategory} class="filter-select">
                        {#each categories as category}
                            <option value={category.value}>{category.label}</option>
                        {/each}
                    </select>

                    <select bind:value={selectedEquipment} class="filter-select">
                        {#each equipmentTypes as equipment}
                            <option value={equipment.value}>{equipment.label}</option>
                        {/each}
                    </select>
                </div>
            </div>

                        <!-- Exercise Grid -->
            <div class="exercises-container">
                {#if loading}
                    <div class="loading">
                        <div class="loading-spinner"></div>
                        <p>Loading exercises...</p>
                    </div>
                {:else if filteredExercises.length === 0}
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <h2>No exercises found</h2>
                        <p>Try adjusting your search or filters</p>
                    </div>
                {:else}
                                            <div class="exercises-scroll-area">
                        <div class="exercises-grid">
                            {#each exerciseStates as exercise}
                                                            <div class="exercise-card" class:already-added={exercise.isInRoutine}>



                                    <div class="exercise-header">
                                        <div class="exercise-icon">
                                            <ExerciseIcon
                                                category={exercise.category}
                                                exerciseName={exercise.name}
                                                size={24}
                                            />
                                        </div>
                                        <div class="exercise-info">
                                            <h3>{exercise.name}</h3>
                                            <p class="exercise-description">{exercise.description}</p>
                                        </div>
                                    </div>

                                    <div class="exercise-meta">
                                        <div class="meta-item">
                                            <span class="meta-icon">
                                                <ExerciseIcon
                                                    category={exercise.equipment?.type || 'bodyweight'}
                                                    size={16}
                                                />
                                            </span>
                                            <span class="meta-text">{exercise.equipment?.name || 'Bodyweight'}</span>
                                        </div>
                                        <div class="meta-item">
                                            <span class="meta-label">Category:</span>
                                            <span class="meta-text">{exercise.category}</span>
                                        </div>
                                    </div>

                                    {#if exercise.instructions}
                                        <div class="exercise-instructions">
                                            <h4>Instructions:</h4>
                                            <p>{exercise.instructions}</p>
                                        </div>
                                    {/if}

                                    {#if exercise.safetyTips}
                                        <div class="exercise-safety">
                                            <h4>Safety Tips:</h4>
                                            <p>{exercise.safetyTips}</p>
                                        </div>
                                    {/if}

                                    {#if exercise.targetMuscles}
                                        <div class="exercise-targets">
                                            <h4>Target Muscles:</h4>
                                            <p>{exercise.targetMuscles}</p>
                                        </div>
                                    {/if}

                                    <div class="exercise-actions">
                                                                                                                {#if exercise.isInRoutine}
                                        <Button variant="danger" size="small" on:click={() => removeFromRoutine(exercise.id)}>
                                            - Remove from Routine
                                        </Button>
                                    {:else}
                                        <Button
                                            variant="primary"
                                            size="small"
                                            on:click={() => addToRoutine(exercise.id)}
                                        >
                                            <ExerciseIcon category="default" size={16} /> Add to Routine
                                        </Button>
                                    {/if}

                                        <Button variant="secondary" size="small" on:click={() => window.open(`/exercises/${exercise.id}`, '_blank')}>
                                            <ExerciseIcon category="default" size={16} /> View Details
                                        </Button>
                                    </div>
                                </div>
                            {/each}
                        </div>

                        <div class="results-info">
                            Showing {exerciseStates.length} of {exercises.length} exercises
                        </div>
                    </div>
                {/if}
            </div>

                        <!-- Modal Actions -->
            <div class="modal-actions">
                <div class="left-actions">
                    <Button variant="secondary" on:click={() => showAddExerciseModal = true}>
                        <ExerciseIcon category="default" size={16} /> Create New Exercise
                    </Button>
                </div>

                <div class="right-actions">
                    <Button variant="secondary" on:click={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" on:click={closeModal}>
                        Done
                    </Button>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Create Exercise Modal -->
<AddExerciseModal
    bind:isOpen={showAddExerciseModal}
    on:save={handleCreateExercise}
    on:cancel={() => showAddExerciseModal = false}
/>

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
        max-width: 1200px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    }

    .modal-header {
        background: white;
        padding: 2rem 0 1.5rem 0;
        margin: 0 0 1.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--primary);
    }



    .filters {
        background: white;
        padding: 1.5rem 0;
        margin: 0 0 2rem 0;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .search-box {
        flex: 1;
        min-width: 250px;
    }

    .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--primary);
    }

    .filter-controls {
        display: flex;
        gap: 0.5rem;
    }

    .filter-select {
        padding: 0.75rem 1rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        background-color: white;
        cursor: pointer;
    }

    .filter-select:focus {
        outline: none;
        border-color: var(--primary);
    }

    .exercises-container {
        margin-bottom: 2rem;
    }

    .exercises-scroll-area {
        max-height: 60vh;
        overflow-y: auto;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background: white;
    }

    .exercises-scroll-area::-webkit-scrollbar {
        width: 8px;
    }

    .exercises-scroll-area::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .exercises-scroll-area::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
    }

    .exercises-scroll-area::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
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
        margin: 0;
    }

    .exercises-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .exercise-card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        transition: all 0.2s ease;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1rem;
        background: white;
    }



    .exercise-card.already-added {
        background: rgba(0, 0, 0, 0.02);
        border-color: rgba(0, 0, 0, 0.15);
    }





    .exercise-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .exercise-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .exercise-info h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .exercise-description {
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    .exercise-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .meta-icon {
        font-size: 1rem;
    }

    .meta-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--tertiary);
        min-width: 80px;
    }

    .meta-text {
        font-size: 0.875rem;
        color: var(--primary);
        font-weight: 500;
    }

    .exercise-instructions {
        padding: 1rem;
        background-color: var(--blue-50);
        border-radius: 0.5rem;
        border-left: 4px solid var(--blue-500);
    }

    .exercise-instructions h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .exercise-instructions p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    .exercise-safety, .exercise-targets {
        padding: 1rem;
        background-color: var(--teal-50);
        border-radius: 0.5rem;
        border-left: 4px solid var(--teal-500);
        margin-top: 1rem;
    }

    .exercise-safety h4, .exercise-targets h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .exercise-safety p, .exercise-targets p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    .exercise-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .results-info {
        text-align: center;
        color: var(--tertiary);
        font-size: 0.875rem;
        font-weight: 500;
    }

    .modal-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .left-actions, .right-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
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

    @media (max-width: 768px) {
        .modal-content {
            padding: 1rem;
            margin: 1rem;
        }

        .modal-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .filters {
            flex-direction: column;
            align-items: stretch;
        }

        .search-box {
            min-width: auto;
        }

        .filter-controls {
            flex-direction: column;
        }

        .exercises-grid {
            grid-template-columns: 1fr;
        }

        .exercise-actions {
            flex-direction: column;
        }

        .modal-actions {
            flex-direction: column;
            align-items: stretch;
        }

        .left-actions, .right-actions {
            justify-content: center;
        }
    }
</style>
