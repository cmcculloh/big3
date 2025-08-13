<script>
    import { page } from '$app/stores';
    import Button from './Button.svelte';
    import { goto } from '$app/navigation';

    // Get user data from page data
    $: user = $page.data.user;

    async function handleLogout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Redirect to login page
                goto('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    function goToLogin() {
        goto('/login');
    }
</script>

<nav>
    <div class="nav-left">
        <a href="/" class="nav-brand">🏋️ Big3</a>
        <a href="/routines">Routines</a>
        <a href="/exercises">Exercises</a>
        <a href="/workouts">Workouts</a>
        <a href="/history">History</a>
        <a href="/ai">🤖 AI</a>
    </div>

    <div class="nav-right">
        {#if user}
            <div class="user-menu">
                <a href="/profile" class="profile-link">👤 {user.username}</a>
                <Button variant="secondary" size="small" on:click={handleLogout}>
                    Logout
                </Button>
            </div>
        {:else}
            <Button variant="primary" size="small" on:click={goToLogin}>
                Sign In
            </Button>
        {/if}
    </div>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .nav-brand {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        color: white;
        border: none;
    }

    nav a {
        color: #1f2937;
        text-decoration: none;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    nav a:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    nav a:active {
        transform: translateY(0);
    }

    .user-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .username {
        font-weight: 600;
        color: var(--primary);
        font-size: 0.875rem;
    }

    .profile-link {
        font-weight: 600;
        color: var(--primary);
        font-size: 0.875rem;
        text-decoration: none;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
    }

    .profile-link:hover {
        background-color: var(--subtle);
        color: var(--primary);
    }

    @media (max-width: 768px) {
        nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }

        .nav-left {
            flex-wrap: wrap;
            justify-content: center;
        }

        .nav-right {
            justify-content: center;
        }

        nav a {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
    }
</style>