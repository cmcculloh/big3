<script>
	import Nav from '$lib/components/nav.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import ExerciseModal from '$lib/components/ExerciseModal.svelte';
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

	// Modal states
	let showDeleteModal = false;
	let showExerciseModal = false;
	let exerciseToEdit = null;
	let isEditingExercise = false;
	let exerciseToDelete = null;
	let autoSaving = false;

	// Drag and drop state
	let draggedExercise = null;
	let draggedOverExercise = null;
	let dragOverIndex = -1;

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
				name: 'Push-ups',
				description: 'Standard push-ups',
				category: 'strength',
				sets: 3,
				reps: 10,
				weight: null,
				bandStrength: null,
				restBetweenSets: 60
			},
			{
				id: 2,
				name: 'Dumbbell Rows',
				description: 'Single-arm dumbbell rows',
				category: 'strength',
				sets: 3,
				reps: 12,
				weight: 25,
				bandStrength: null,
				restBetweenSets: 60
			},
			{
				id: 3,
				name: 'Plank Hold',
				description: 'Hold plank position',
				category: 'strength',
				sets: 3,
				duration: 30,
				weight: null,
				bandStrength: null,
				restBetweenSets: 45
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

	onMount(async () => {
		try {
			console.log('🔍 Loading routine for editing, ID:', routineId);

			// Fetch the real routine data from the database
			const response = await fetch(`/api/routines/${routineId}`);

			if (response.ok) {
				const data = await response.json();
				console.log('✅ Routine data received for editing:', data);
				routine = data.routine;

				// Populate form with existing data
				routineName = routine.name;
				routineDescription = routine.description;
				routineCategory = routine.category;
				estimatedDuration = routine.estimatedDuration;
			} else {
				console.warn('⚠️ Failed to fetch routine for editing, using mock data');
				// Fallback to mock data if API fails
				routine = mockRoutine;
				routineName = routine.name;
				routineDescription = routine.description;
				routineCategory = routine.category;
				estimatedDuration = routine.estimatedDuration;
			}

			loading = false;
		} catch (err) {
			console.error('❌ Error loading routine for editing:', err);
			// Fallback to mock data
			routine = mockRoutine;
			routineName = routine.name;
			routineDescription = routine.description;
			routineCategory = routine.category;
			estimatedDuration = routine.estimatedDuration;
			loading = false;
		}
	});

	async function saveRoutine() {
		if (!routineName.trim()) {
			alert('Please enter a routine name');
			return;
		}

		saving = true;

		try {
			// First save the routine details
			const routineResponse = await fetch(`/api/routines/${routineId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: routineName,
					description: routineDescription,
					category: routineCategory,
					estimatedDuration: estimatedDuration
				})
			});

			if (!routineResponse.ok) {
				const errorData = await routineResponse.json();
				throw new Error(errorData.error || 'Failed to update routine');
			}

			// Then save the exercises
			const exercisesResponse = await fetch(`/api/routines/${routineId}/exercises`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					exercises: routine.exercises
				})
			});

			if (!exercisesResponse.ok) {
				const errorData = await exercisesResponse.json();
				throw new Error(errorData.error || 'Failed to update exercises');
			}

			console.log('✅ Routine and exercises updated successfully');
			alert('Routine saved successfully!');
			window.location.href = '/routines';
		} catch (error) {
			console.error('❌ Error saving routine:', error);
			alert(`Failed to save routine: ${error.message}`);
		} finally {
			saving = false;
		}
	}

	function cancelEdit() {
		if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
			window.location.href = '/routines';
		}
	}

	function showAddExerciseModal() {
		exerciseToEdit = null;
		isEditingExercise = false;
		showExerciseModal = true;
	}

	function showEditExerciseModal(exercise) {
		exerciseToEdit = exercise;
		isEditingExercise = true;
		showExerciseModal = true;
	}

	async function handleExerciseSave(event) {
		const exerciseData = event.detail;

		if (isEditingExercise && exerciseToEdit) {
			// Update existing exercise
			const index = routine.exercises.findIndex((ex) => ex.id === exerciseToEdit.id);
			if (index !== -1) {
				routine.exercises[index] = { ...exerciseToEdit, ...exerciseData };
			}
		} else {
			// Add new exercise
			const newExercise = {
				id: Date.now(), // Temporary ID for new exercises
				...exerciseData
			};
			routine.exercises = [...routine.exercises, newExercise];
		}

		// Update estimated duration based on exercises
		updateEstimatedDuration();

		// Auto-save exercises to database
		await saveExercisesToDatabase();
	}

	function showDeleteExerciseConfirmation(exercise) {
		exerciseToDelete = exercise;
		showDeleteModal = true;
	}

	async function handleDeleteExerciseConfirm() {
		if (exerciseToDelete) {
			routine.exercises = routine.exercises.filter((ex) => ex.id !== exerciseToDelete.id);
			updateEstimatedDuration();

			// Auto-save exercises to database
			await saveExercisesToDatabase();

			exerciseToDelete = null;
			showDeleteModal = false;
		}
	}

	function handleDeleteExerciseCancel() {
		exerciseToDelete = null;
		showDeleteModal = false;
	}

	function updateEstimatedDuration() {
		// Calculate estimated duration based on exercises
		let totalDuration = 0;

		routine.exercises.forEach((exercise) => {
			const exerciseTime = exercise.sets * (exercise.restBetweenSets || 60);
			if (exercise.duration) {
				totalDuration += exercise.sets * exercise.duration;
			} else {
				totalDuration += exercise.sets * 30; // Assume 30 seconds per set
			}
			totalDuration += exercise.restBetweenSets || 60;
		});

		// Add warm-up and cool-down time
		totalDuration += 300; // 5 minutes for warm-up/cool-down

		estimatedDuration = Math.ceil(totalDuration / 60); // Convert to minutes
	}

	async function saveExercisesToDatabase() {
		autoSaving = true;
		try {
			const response = await fetch(`/api/routines/${routineId}/exercises`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					exercises: routine.exercises
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Failed to save exercises:', errorData.error);
				// Don't show alert for auto-save failures, just log them
			} else {
				console.log('✅ Exercises auto-saved successfully');
			}
		} catch (error) {
			console.error('Error auto-saving exercises:', error);
			// Don't show alert for auto-save failures, just log them
		} finally {
			autoSaving = false;
		}
	}

	function handleDragStart(event, exercise) {
		draggedExercise = exercise;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', exercise.id.toString());

		// Add dragging class to the dragged element
		const draggedElement = event.currentTarget;
		draggedElement.classList.add('dragging');

		// Set a small delay to make the drag effect visible
		setTimeout(() => {
			draggedElement.style.opacity = '0.5';
		}, 0);
	}

	function handleDragOver(event, exercise, index) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';

		if (draggedExercise) {
			draggedOverExercise = exercise;
			dragOverIndex = index;

			// Add visual feedback for drop target
			const currentElement = event.currentTarget;
			currentElement.classList.add('drag-over');

			// Remove drag-over from other elements
			document.querySelectorAll('.drop-zone, .exercise-item').forEach((el) => {
				if (el !== currentElement) {
					el.classList.remove('drag-over');
				}
			});
		}
	}

	function handleDragLeave(event) {
		// Only remove drag-over if we're leaving the element entirely
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			event.currentTarget.classList.remove('drag-over');
		}
	}

	async function handleDrop(event, targetExercise, targetIndex) {
		event.preventDefault();

		if (!draggedExercise) {
			return;
		}

		// Remove all drag styling
		document.querySelectorAll('.drop-zone, .exercise-item').forEach((el) => {
			el.classList.remove('drag-over');
		});

		const draggedElement = document.querySelector('.dragging');
		if (draggedElement) {
			draggedElement.classList.remove('dragging');
			draggedElement.style.opacity = '';
		}

		// Reorder exercises
		const draggedIndex = routine.exercises.findIndex((ex) => ex.id === draggedExercise.id);

		if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
			// Create a copy of the exercises array
			const newExercises = [...routine.exercises];

			// Remove the dragged exercise
			const [movedExercise] = newExercises.splice(draggedIndex, 1);

			// Insert at the target position
			newExercises.splice(targetIndex, 0, movedExercise);

			// Update the routine exercises
			routine.exercises = newExercises;

			// Auto-save exercises to database after reordering
			await saveExercisesToDatabase();
		}

		draggedExercise = null;
		draggedOverExercise = null;
		dragOverIndex = -1;
	}

	function handleDragEnd(event) {
		// Remove all drag styling
		const draggedElement = event.currentTarget;
		draggedElement.classList.remove('dragging');
		draggedElement.style.opacity = '';

		document.querySelectorAll('.drop-zone, .exercise-item').forEach((el) => {
			el.classList.remove('drag-over');
		});

		draggedExercise = null;
		draggedOverExercise = null;
		dragOverIndex = -1;
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
			<Button variant="secondary" on:click={cancelEdit}>❌ Cancel</Button>
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
					<div class="exercises-actions">
						{#if autoSaving}
							<span class="auto-save-indicator">💾 Auto-saving...</span>
						{/if}
						<Button variant="primary" size="small" on:click={showAddExerciseModal}>
							➕ Add Exercise
						</Button>
					</div>
				</div>

				{#if routine.exercises.length === 0}
					<div class="empty-exercises">
						<p>No exercises in this routine yet.</p>
						<Button variant="primary" on:click={showAddExerciseModal}>
							Add Your First Exercise
						</Button>
					</div>
				{:else}
					<div class="exercises-list">
						{#each routine.exercises as exercise, index}
							<div
								class="exercise-item"
								draggable="true"
								on:dragstart={(event) => handleDragStart(event, exercise)}
								on:dragover={(event) => handleDragOver(event, exercise, index)}
								on:dragleave={(event) => handleDragLeave(event)}
								on:drop={(event) => handleDrop(event, exercise, index)}
								on:dragend={(event) => handleDragEnd(event)}
							>
								<div class="exercise-info">
									<div class="drag-handle">⋮⋮</div>
									<div class="exercise-content">
										<div class="exercise-name">{exercise.name}</div>
										<div class="exercise-details">
											{#if exercise.reps}
												<span class="detail">{exercise.sets} sets × {exercise.reps} reps</span>
											{:else if exercise.duration}
												<span class="detail">{exercise.sets} sets × {exercise.duration}s</span>
											{:else}
												<span class="detail">{exercise.sets} sets</span>
											{/if}
											{#if exercise.weight}
												<span class="detail">@ {exercise.weight} lbs</span>
											{/if}
											{#if exercise.bandStrength}
												<span class="detail">@ {exercise.bandStrength} band</span>
											{/if}
										</div>
									</div>
								</div>

								<div class="exercise-actions">
									<Button
										variant="secondary"
										size="small"
										on:click={() => showEditExerciseModal(exercise)}
									>
										✏️ Edit
									</Button>
									<Button
										variant="danger"
										size="small"
										on:click={() => showDeleteExerciseConfirmation(exercise)}
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

	{#if showDeleteModal}
		<ConfirmModal
			bind:isOpen={showDeleteModal}
			title="Confirm Deletion"
			message="Are you sure you want to remove this exercise from the routine?"
			variant="danger"
			confirmText="Remove"
			cancelText="Cancel"
			on:confirm={handleDeleteExerciseConfirm}
			on:cancel={handleDeleteExerciseCancel}
		/>
	{/if}

	{#if showExerciseModal}
		<ExerciseModal
			bind:isOpen={showExerciseModal}
			exercise={exerciseToEdit}
			isEditing={isEditingExercise}
			on:save={handleExerciseSave}
			on:cancel={() => (showExerciseModal = false)}
		/>
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
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
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

	.exercises-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.auto-save-indicator {
		font-size: 0.875rem;
		color: var(--primary);
		font-weight: 600;
		background-color: var(--subtle);
		padding: 0.25rem 0.75rem;
		border-radius: 0.5rem;
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

	.exercise-item.dragging {
		opacity: 0.5;
		background-color: var(--primary-light);
		border: 2px dashed var(--primary);
		transform: rotate(2deg);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	}

	.exercise-item.drag-over {
		background-color: var(--primary-light);
		border: 2px dashed var(--primary);
		transform: scale(1.02);
	}

	.exercise-item:hover .drag-handle {
		color: var(--primary);
	}

	.exercise-item.dragging .drag-handle {
		cursor: grabbing;
	}

	.exercise-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.drag-handle {
		font-size: 1.5rem;
		color: var(--tertiary);
		cursor: grab;
		user-select: none;
	}

	.exercise-content {
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

	.drag-instructions {
		text-align: center;
		padding: 1rem 0;
		color: var(--primary);
		font-size: 0.875rem;
		background-color: var(--subtle);
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.drop-zone {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--subtle);
		border-radius: 8px;
		margin: 0.5rem 0;
		border: 2px dashed transparent;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.drop-zone:hover {
		background-color: var(--primary-light);
		border-color: var(--primary);
	}

	.drop-zone.drag-over {
		border-color: var(--primary);
		background-color: var(--primary-light);
		transform: scale(1.02);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.drop-indicator {
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.drop-zone:hover .drop-indicator,
	.drop-zone.drag-over .drop-indicator {
		color: var(--primary);
		font-weight: 600;
	}

	.exercise-item {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: all 0.2s ease;
		cursor: grab;
	}

	.exercise-item:hover {
		border-color: var(--primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.exercise-item.dragging {
		opacity: 0.5;
		background-color: var(--primary-light);
		border: 2px dashed var(--primary);
		transform: rotate(2deg);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
		cursor: grabbing;
	}

	.exercise-item.drag-over {
		background-color: var(--primary-light);
		border: 2px dashed var(--primary);
		transform: scale(1.02);
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
