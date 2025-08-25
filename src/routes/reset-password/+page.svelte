<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let { form } = $props();
    let isLoading = $state(false);
    let isSuccess = $state(false);

    $effect(() => {
        if (form?.success) {
            isSuccess = true;
        }
    });
    let token = $state('');

    onMount(() => {
        // Redirect if already logged in
        if (form?.user) {
            goto('/');
        }

        // Get token from URL
        token = $page.url.searchParams.get('token') || '';

        if (!token) {
            goto('/forgot-password');
        }
    });

    function handleSubmit() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            event.preventDefault();
            alert('Passwords do not match');
            return false;
        }

        isLoading = true;
    }
</script>

<svelte:head>
    <title>Reset Password - Big3 Fitness</title>
</svelte:head>

<main class="reset-password-page">
    <div class="reset-password-container">
        <Card class="reset-password-card">
            <div class="reset-password-header">
                <h1>Reset Your Password</h1>
                <p>Enter your new password below</p>
            </div>

            {#if !isSuccess}
                <form method="post" action="?/resetPassword" onsubmit={handleSubmit}>
                    <input type="hidden" name="token" value={token} />

                    <div class="form-group">
                        <label for="password">New Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minlength="6"
                            placeholder="Enter your new password"
                            disabled={isLoading}
                        />
                        <small>Minimum 6 characters</small>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minlength="6"
                            placeholder="Confirm your new password"
                            disabled={isLoading}
                        />
                        <small>Please confirm your new password</small>
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
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>
                </form>
            {:else}
                <div class="success-message">
                    <h2>Password Reset Successful!</h2>
                    <p>Your password has been successfully reset. You can now log in with your new password.</p>
                </div>
            {/if}

            <div class="back-to-login">
                <a href="/login" class="back-link">← Back to Login</a>
            </div>
        </Card>
    </div>
</main>

<style>
    .reset-password-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        padding: 2rem;
    }

    .reset-password-container {
        width: 100%;
        max-width: 400px;
    }

    .reset-password-card {
        padding: 2.5rem;
        text-align: center;
    }

    .reset-password-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .reset-password-header p {
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

    .success-message {
        text-align: center;
        margin-bottom: 2rem;
    }

    .success-message h2 {
        color: #059669;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
    }

    .success-message p {
        color: var(--tertiary);
        margin: 0 0 1rem 0;
        line-height: 1.6;
    }

    .submit-btn {
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .back-to-login {
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid var(--subtle);
    }

    .back-link {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
    }

    .back-link:hover {
        color: var(--accent);
        text-decoration: underline;
    }

    @media (max-width: 480px) {
        .reset-password-page {
            padding: 1rem;
        }

        .reset-password-card {
            padding: 2rem 1.5rem;
        }

        .reset-password-header h1 {
            font-size: 1.75rem;
        }
    }
</style>
