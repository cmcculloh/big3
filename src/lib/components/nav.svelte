<nav>
    <a href="/">Home</a>
    <a href="/routines">Routines</a>
    <a href="/exercises">Exercises</a>
    <a href="/workouts">Workouts</a>
    <a href="/history">History</a>
    <a href="/ai">🤖 AI</a>
</nav>

<style>
    nav {
        display: flex;
        padding: 1.5rem 2rem;
        background: rgba(255, 255, 255, 0.95);
        gap: 1rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: sticky;
        top: 0;
        z-index: 100;
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
</style>