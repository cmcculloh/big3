<script>
    import { goto } from '$app/navigation';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let { form } = $props();
    let isLoading = false;
    let isLoginMode = true; // true for login, false for register

    onMount(() => {
        // Redirect if already logged in
        if (form?.user) {
            goto('/');
        }
    });

    function handleSubmit() {
        isLoading = true;
    }

    function toggleMode() {
        isLoginMode = !isLoginMode;
        isLoading = false;
        // Clear any previous error messages
        if (form?.message) {
            form.message = null;
        }
    }
</script>

<svelte:head>
    <title>{isLoginMode ? 'Login' : 'Create Account'} - Big3 Fitness</title>
</svelte:head>

<main class="login-page">
    <div class="login-container">
        <Card class="login-card">
            <div class="login-header">
                <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
                <p>{isLoginMode ? 'Sign in to track your workouts and progress' : 'Join Big3 Fitness to start your fitness journey'}</p>
            </div>

            <form method="post" action={isLoginMode ? "?/login" : "?/register"} on:submit={handleSubmit}>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        minlength="3"
                        maxlength="31"
                        pattern="[a-z0-9_-]+"
                        placeholder="Enter your username"
                        disabled={isLoading}
                    />
                    <small>3-31 characters, alphanumeric, hyphens, underscores only</small>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minlength="6"
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                    <small>Minimum 6 characters</small>
                </div>

                {#if form?.message}
                    <div class="error-message">
                        {form.message}
                    </div>
                {/if}

                <Button
                    type="submit"
                    variant="primary"
                    class="submit-btn"
                    disabled={isLoading}
                >
                    {#if isLoginMode}
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    {:else}
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    {/if}
                </Button>
            </form>

            <div class="mode-toggle">
                <p>
                    {#if isLoginMode}
                        Don't have an account?
                    {:else}
                        Already have an account?
                    {/if}
                    <button type="button" class="toggle-btn" on:click={toggleMode}>
                        {#if isLoginMode}
                            Create an Account
                        {:else}
                            Sign In
                        {/if}
                    </button>
                </p>
            </div>
        </Card>
    </div>
</main>

<style>
    .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        padding: 2rem;
    }

    .login-container {
        width: 100%;
        max-width: 400px;
    }

    .login-card {
        padding: 2.5rem;
        text-align: center;
    }

    .login-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .login-header p {
        color: var(--tertiary);
        margin: 0 0 2rem 0;
        font-size: 1.125rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
        text-align: left;
    }

    .form-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--primary);
    }

    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
    }

    .form-group input:focus {
        outline: none;
        border-color: var(--primary);
    }

    .form-group input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .form-group small {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: var(--tertiary);
    }

    .error-message {
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
    }

    .submit-btn {
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .mode-toggle {
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid var(--subtle);
    }

    .mode-toggle p {
        color: var(--tertiary);
        margin: 0;
        font-size: 0.875rem;
    }

    .toggle-btn {
        background: none;
        border: none;
        color: var(--primary);
        font-weight: 600;
        text-decoration: underline;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        margin-left: 0.5rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }

    .toggle-btn:hover {
        background-color: var(--subtle);
        text-decoration: none;
    }

    .toggle-btn:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    @media (max-width: 480px) {
        .login-page {
            padding: 1rem;
        }

        .login-card {
            padding: 2rem 1.5rem;
        }

        .login-header h1 {
            font-size: 1.75rem;
        }
    }
</style>
