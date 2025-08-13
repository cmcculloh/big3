<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let loading = false;
    let result = null;
    let error = null;

    async function createDemoUser() {
        try {
            loading = true;
            error = null;
            result = null;

            const response = await fetch('/api/setup-demo-user', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                result = data;
            } else {
                error = data.error || 'Failed to create demo user';
            }
        } catch (err) {
            error = 'Network error occurred';
            console.error('Demo setup error:', err);
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Demo Setup - Big3 Fitness</title>
</svelte:head>

<Nav />

<main class="demo-setup">
    <div class="setup-container">
        <Card class="setup-card">
            <div class="setup-header">
                <h1>Demo Account Setup</h1>
                <p>Create a demo account to test the application features</p>
            </div>

            <div class="setup-content">
                <p>
                    This will create a demo user account with the following credentials:
                </p>
                <div class="demo-credentials">
                    <div class="credential">
                        <span class="credential-label">Username:</span>
                        <span class="credential-value">demo</span>
                    </div>
                    <div class="credential">
                        <span class="credential-label">Password:</span>
                        <span class="credential-value">demo123</span>
                    </div>
                </div>

                <Button
                    variant="primary"
                    on:click={createDemoUser}
                    disabled={loading}
                    class="setup-btn"
                >
                    {loading ? 'Creating Demo User...' : 'Create Demo User'}
                </Button>

                {#if result}
                    <div class="success-message">
                        <h3>✅ Demo User Created Successfully!</h3>
                        <p>You can now sign in with:</p>
                        <div class="login-info">
                            <strong>Username:</strong> {result.username}<br>
                            <strong>Password:</strong> {result.password}
                        </div>
                        <Button variant="primary" href="/login" class="login-btn">
                            Go to Login
                        </Button>
                    </div>
                {/if}

                {#if error}
                    <div class="error-message">
                        <h3>❌ Error</h3>
                        <p>{error}</p>
                    </div>
                {/if}
            </div>

            <div class="setup-footer">
                <p>
                    <strong>Note:</strong> This is for demonstration purposes only.
                    In a production environment, users would create their own accounts.
                </p>
            </div>
        </Card>
    </div>
</main>

<style>
    .demo-setup {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        padding: 2rem;
    }

    .setup-container {
        width: 100%;
        max-width: 500px;
    }

    .setup-card {
        padding: 2.5rem;
        text-align: center;
    }

    .setup-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .setup-header p {
        color: var(--tertiary);
        margin: 0 0 2rem 0;
        font-size: 1.125rem;
    }

    .setup-content {
        text-align: left;
        margin-bottom: 2rem;
    }

    .setup-content p {
        color: var(--tertiary);
        margin: 0 0 1.5rem 0;
        line-height: 1.6;
    }

    .demo-credentials {
        background-color: var(--subtle);
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
    }

    .credential {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .credential:last-child {
        margin-bottom: 0;
    }

    .credential-label {
        font-weight: 600;
        color: var(--primary);
    }

    .credential-value {
        font-family: monospace;
        background-color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-weight: 600;
        color: var(--primary);
    }

    .setup-btn {
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .success-message {
        background-color: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #166534;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .success-message h3 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
    }

    .success-message p {
        margin: 0 0 1rem 0;
        color: #166534;
    }

    .login-info {
        background-color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-family: monospace;
        text-align: left;
    }

    .login-btn {
        width: 100%;
    }

    .error-message {
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .error-message h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
    }

    .error-message p {
        margin: 0;
        color: #dc2626;
    }

    .setup-footer {
        border-top: 1px solid var(--subtle);
        padding-top: 1.5rem;
    }

    .setup-footer p {
        color: var(--tertiary);
        font-size: 0.875rem;
        margin: 0;
        line-height: 1.5;
    }

    @media (max-width: 480px) {
        .demo-setup {
            padding: 1rem;
        }

        .setup-card {
            padding: 2rem 1.5rem;
        }

        .setup-header h1 {
            font-size: 1.75rem;
        }

        .credential {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
</style>
