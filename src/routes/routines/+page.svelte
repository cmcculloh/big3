<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import ConfirmModal from '$lib/components/ConfirmModal.svelte';
    import AlertModal from '$lib/components/AlertModal.svelte';
    import { onMount } from 'svelte';

    let routines = [];
    let loading = true;
    let showCreateForm = false;

    // Confirmation modal state
    let showDeleteModal = false;
    let routineToDelete = null;

    // Alert modal state
    let showAlertModal = false;
    let alertTitle = '';
    let alertMessage = '';
    let alertVariant = 'info';

    // Mock data for now - will be replaced with actual API calls
    const mockRoutines = [
        {
            id: 1,
            name: 'Upper Body Strength',
            description: 'Focus on chest, back, and arms',
            category: 'strength',
            estimatedDuration: 45,
            exerciseCount: 6,
            lastUsed: '2024-01-15'
        },
        {
            id: 2,
            name: 'Cardio Circuit',
            description: 'High-intensity interval training',
            category: 'cardio',
            estimatedDuration: 30,
            exerciseCount: 8,
            lastUsed: '2024-01-12'
        },
        {
            id: 3,
            name: 'Full Body Workout',
            description: 'Complete body workout for all muscle groups',
            category: 'full_body',
            estimatedDuration: 60,
            exerciseCount: 10,
            lastUsed: '2024-01-10'
        }
    ];

    onMount(async () => {
        try {
            // Fetch real routines from the database
            const response = await fetch('/api/routines');

            if (response.ok) {
                const data = await response.json();
                routines = data.routines;
            } else {
                console.warn('Failed to fetch routines, using mock data');
                routines = mockRoutines;
            }

            loading = false;
        } catch (err) {
            console.error('Error loading routines:', err);
            // Fallback to mock data
            routines = mockRoutines;
            loading = false;
        }
    });

    function startWorkout(routineId) {
        // Navigate to workout session
        window.location.href = `/workout/${routineId}`;
    }

    function editRoutine(routineId) {
        // Navigate to edit routine page
        window.location.href = `/routines/${routineId}/edit`;
    }

    function showDeleteConfirmation(routine) {
        routineToDelete = routine;
        showDeleteModal = true;
    }

    function showAlert(title, message, variant = 'info') {
        alertTitle = title;
        alertMessage = message;
        alertVariant = variant;
        showAlertModal = true;
    }

    function closeAlert() {
        showAlertModal = false;
    }

    async function handleDeleteConfirm() {
        if (!routineToDelete) return;

        try {
            const response = await fetch(`/api/routines/${routineToDelete.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove from local array after successful deletion
                routines = routines.filter(r => r.id !== routineToDelete.id);
                console.log('✅ Routine deleted successfully');
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to delete routine:', errorData.error);
                showAlert('Error', `Failed to delete routine: ${errorData.error}`, 'error');
            }
        } catch (error) {
            console.error('❌ Error deleting routine:', error);
            showAlert('Error', 'Failed to delete routine. Please try again.', 'error');
        }

        // Reset modal state
        routineToDelete = null;
        showDeleteModal = false;
    }

    function handleDeleteCancel() {
        routineToDelete = null;
        showDeleteModal = false;
    }

    function getCategoryIcon(category) {
        const icons = {
            strength: '🏋️',
            cardio: '🏃',
            full_body: '💪',
            flexibility: '🧘',
            yoga: '🧘‍♀️'
        };
        return icons[category] || '🏋️';
    }

    function formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
</script>

<Nav />

<main class="routines">
    <div class="routines-header">
        <div class="routines-title">
            <h1>My Routines</h1>
            <p>Manage and organize your workout routines</p>
        </div>
        <Button variant="primary" href="/routines/create">
            ➕ Create Routine
        </Button>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading your routines...</p>
        </div>
    {:else if routines.length === 0}
        <div class="empty-state">
            <div class="empty-icon">🏋️</div>
            <h2>No routines yet</h2>
            <p>Create your first workout routine to get started</p>
            <Button variant="primary" on:click={() => showCreateForm = true}>
                Create Your First Routine
            </Button>
        </div>
    {:else}
        <div class="routines-grid">
            {#each routines as routine}
                <Card class="routine-card">
                    <div class="routine-header">
                        <div class="routine-icon">{getCategoryIcon(routine.category)}</div>
                        <div class="routine-info">
                            <h3>{routine.name}</h3>
                            <p class="routine-description">{routine.description}</p>
                        </div>
                    </div>

                    <div class="routine-stats">
                        <div class="stat">
                            <span class="stat-label">Duration</span>
                            <span class="stat-value">{formatDuration(routine.estimatedDuration)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Exercises</span>
                            <span class="stat-value">{routine.exerciseCount}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Last Used</span>
                            <span class="stat-value">{routine.lastUsed}</span>
                        </div>
                    </div>

                    <div class="routine-actions">
                        <Button variant="success" size="small" on:click={() => startWorkout(routine.id)}>
                            ▶️ Start
                        </Button>
                        <Button variant="secondary" size="small" on:click={() => editRoutine(routine.id)}>
                            ✏️ Edit
                        </Button>
                        <Button variant="danger" size="small" on:click={() => showDeleteConfirmation(routine)}>
                            🗑️ Delete
                        </Button>
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</main>

<ConfirmModal
    bind:isOpen={showDeleteModal}
    title="Confirm Deletion"
    message={`Are you sure you want to delete the routine "${routineToDelete?.name}"? This action cannot be undone.`}
    variant="danger"
    confirmText="Delete"
    cancelText="Cancel"
    on:confirm={handleDeleteConfirm}
    on:cancel={handleDeleteCancel}
/>

<AlertModal
    bind:isOpen={showAlertModal}
    title={alertTitle}
    message={alertMessage}
    variant={alertVariant}
    on:close={closeAlert}
/>

<style>
    .routines {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .routines-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        flex-wrap: wrap;
        gap: 1rem;
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
    }

    .routines-title h1 {
        font-size: 3rem;
        font-weight: 800;
        margin: 0 0 0.5rem 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .routines-title p {
        font-size: 1.25rem;
        color: #6b7280;
        margin: 0;
        font-weight: 500;
    }

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 6rem 2rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1.5rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
    }

    .loading-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid #e2e8f0;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 2rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .loading p {
        font-size: 1.125rem;
        color: #6b7280;
        font-weight: 500;
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
        padding: 6rem 2rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1.5rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
    }

    .empty-icon {
        font-size: 5rem;
        margin-bottom: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
    }

    .empty-state h2 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: #1f2937;
    }

    .empty-state p {
        color: #6b7280;
        margin: 0 0 2rem 0;
        font-size: 1.125rem;
        font-weight: 500;
    }

    .routines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        gap: 2rem;
    }

    .routine-card {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .routine-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .routine-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }

    .routine-header {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
    }

    .routine-icon {
        font-size: 3rem;
        flex-shrink: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .routine-info h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.75rem 0;
        color: #1f2937;
        line-height: 1.2;
    }

    .routine-description {
        color: #6b7280;
        margin: 0;
        line-height: 1.6;
        font-size: 1rem;
        font-weight: 500;
    }

    .routine-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0.5rem;
        border-radius: 0.75rem;
        background: rgba(255, 255, 255, 0.7);
        transition: all 0.2s ease;
    }

    .stat:hover {
        background: rgba(255, 255, 255, 0.9);
        transform: scale(1.05);
    }

    .stat-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .routine-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }

    .routine-actions :global(button) {
        border-radius: 0.75rem;
        font-weight: 600;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .routine-actions :global(button:hover) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        .routines {
            padding: 1rem;
        }

        .routines-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .routines-title h1 {
            font-size: 2rem;
        }

        .routines-grid {
            grid-template-columns: 1fr;
        }

        .routine-stats {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .routine-actions {
            flex-direction: column;
        }
    }
</style>
