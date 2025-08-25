<script>
    import { goto } from '$app/navigation';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let { form } = $props();

    let isSubmitted = $state(false);

    $effect(() => {
        if (form?.success) {
            isSubmitted = true;
        }
    });

    function handleSubmit() {
        // Just log the form submission, don't prevent it
        console.log('Form submitted via handleSubmit');
    }

    onMount(() => {
        // Redirect if already logged in
        if (form?.user) {
            goto('/');
        }
    });


</script>

<svelte:head>
    <title>Forgot Password - Big3 Fitness</title>
</svelte:head>

<main class="forgot-password-page">
    <div class="forgot-password-container">
        <Card class="forgot-password-card">
            <div class="forgot-password-header">
                <h1>Forgot Your Password?</h1>
                <p>Enter your username or email and we'll send you a password reset link</p>
            </div>

            {#if !isSubmitted}
                <form method="post" action="?/requestReset">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            minlength="3"
                            maxlength="100"
                            pattern="[a-zA-Z0-9@._-]+"
                            placeholder="Enter your username or email"

                        />
                        <small>3-100 characters, alphanumeric, @, dots, hyphens, underscores</small>
                    </div>

                    {#if form?.message}
                        <div class="error-message">
                            {form.message}
                        </div>
                    {/if}

                    <button
                        type="submit"
                        class="submit-btn"
                        style="width: 100%; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer;"
                    >
                        Send Reset Link
                    </button>
                </form>
            {:else}
                <div class="success-message">
                    <h2>Check Your Email</h2>
                    <p>If an account with that username or email exists, we've sent a password reset link to the email associated with your account.</p>
                    <p class="note">Note: For security reasons, we don't reveal whether an account exists or not.</p>
                </div>
            {/if}

            <div class="back-to-login">
                <a href="/login" class="back-link">← Back to Login</a>
            </div>
        </Card>
    </div>
</main>

<style>
    .forgot-password-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        padding: 2rem;
    }

    .forgot-password-container {
        width: 100%;
        max-width: 400px;
    }

    .forgot-password-card {
        padding: 2.5rem;
        text-align: center;
    }

    .forgot-password-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .forgot-password-header p {
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

    .success-message .note {
        font-size: 0.875rem;
        font-style: italic;
        color: var(--tertiary);
        opacity: 0.8;
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
        .forgot-password-page {
            padding: 1rem;
        }

        .forgot-password-card {
            padding: 2rem 1.5rem;
        }

        .forgot-password-header h1 {
            font-size: 1.75rem;
        }
    }
</style>
