<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';

    // Get user data from page data
    export let data;
    $: ({ user } = data);
</script>

<svelte:head>
    <title>Profile - Big3 Fitness</title>
</svelte:head>

<Nav />

<main class="profile">
    <div class="profile-header">
        <h1>Profile</h1>
        <p>Manage your account and preferences</p>
    </div>

    <div class="profile-content">
        <Card class="profile-card">
            <h2>Account Information</h2>
            <div class="profile-info">
                <div class="info-row">
                    <span class="info-label">Username:</span>
                    <span class="info-value">{user.username}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">User ID:</span>
                    <span class="info-value">{user.id}</span>
                </div>
            </div>
        </Card>

        <Card class="profile-card">
            <h2>Quick Actions</h2>
            <div class="quick-actions">
                <Button variant="primary" href="/routines">
                    🏋️ Manage Routines
                </Button>
                <Button variant="secondary" href="/history">
                    📊 View Progress
                </Button>
                <Button variant="ghost" href="/ai">
                    🤖 AI Workouts
                </Button>
            </div>
        </Card>

        <Card class="profile-card">
            <h2>Account Management</h2>
            <div class="account-actions">
                <Button variant="secondary" href="/api/logout" method="POST">
                    🚪 Sign Out
                </Button>
            </div>
        </Card>
    </div>
</main>

<style>
    .profile {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .profile-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .profile-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .profile-header p {
        font-size: 1.125rem;
        color: var(--tertiary);
        margin: 0;
    }

    .profile-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .profile-card {
        padding: 2rem;
    }

    .profile-card h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        color: var(--primary);
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: var(--subtle);
        border-radius: 0.5rem;
    }

    .info-label {
        font-weight: 600;
        color: var(--primary);
    }

    .info-value {
        font-family: monospace;
        color: var(--tertiary);
        background-color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
    }

    .quick-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .account-actions {
        display: flex;
        gap: 1rem;
    }

    @media (max-width: 768px) {
        .profile {
            padding: 1rem;
        }

        .profile-header h1 {
            font-size: 2rem;
        }

        .quick-actions,
        .account-actions {
            flex-direction: column;
        }

        .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
</style>
