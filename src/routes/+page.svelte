<script>
    import Nav from '$lib/components/nav.svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
</script>

<Nav />

<main class="home">
    <section class="hero">
        <div class="hero-content">
            <h1>Big 3</h1>
            <p class="hero-subtitle">Your Personal Exercise Companion</p>
            <p class="hero-description">
                Build custom routines, track your progress, and achieve your fitness goals with our intuitive workout app.
            </p>
            <div class="hero-actions">
                <Button variant="primary" size="large" href="/routines">
                    Start Workout
                </Button>
                <Button variant="ghost" size="large" href="/routines/create">
                    Create Routine
                </Button>
            </div>
        </div>
    </section>

    <section class="features">
        <h2>Features</h2>
        <div class="features-grid">
            <Card>
                <div class="feature">
                    <div class="feature-icon">🏋️</div>
                    <h3>Custom Routines</h3>
                    <p>Create personalized workout routines with sets, reps, and duration tracking.</p>
                </div>
            </Card>

            <Card>
                <div class="feature">
                    <div class="feature-icon">⏱️</div>
                    <h3>Smart Timer</h3>
                    <p>Built-in countdown timer with audio cues for timed exercises and rest periods.</p>
                </div>
            </Card>

            <Card>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <h3>Progress Tracking</h3>
                    <p>Rate exercise difficulty and automatically adjust weights based on your feedback.</p>
                </div>
            </Card>

            <Card>
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <h3>Auto-Generation</h3>
                    <p>Get personalized workout suggestions based on your goals and available equipment.</p>
                </div>
            </Card>
        </div>
    </section>

    <section class="quick-start">
        <h2>Quick Start</h2>
        <div class="quick-start-grid">
            <Card clickable={true} on:click={() => window.location.href = '/routines'}>
                <div class="quick-action">
                    <div class="quick-action-icon">➕</div>
                    <h3>Create Your First Routine</h3>
                    <p>Build a custom workout routine tailored to your fitness level and goals.</p>
                </div>
            </Card>

            <Card clickable={true} on:click={() => window.location.href = '/exercises'}>
                <div class="quick-action">
                    <div class="quick-action-icon">📝</div>
                    <h3>Browse Exercises</h3>
                    <p>Explore our library of exercises with detailed instructions and equipment requirements.</p>
                </div>
            </Card>

            <Card clickable={true} on:click={() => window.location.href = '/workouts'}>
                <div class="quick-action">
                    <div class="quick-action-icon">🏃</div>
                    <h3>Start Working Out</h3>
                    <p>Begin your fitness journey with guided workout sessions and progress tracking.</p>
                </div>
            </Card>
        </div>
    </section>
</main>

<style>
    .home {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .hero {
        text-align: center;
        padding: 4rem 2rem;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
        border-radius: 1rem;
        margin-bottom: 4rem;
    }

    .hero-content {
        max-width: 600px;
        margin: 0 auto;
    }

    .hero h1 {
        font-size: 3.5rem;
        font-weight: 800;
        margin: 0 0 1rem 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-subtitle {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        opacity: 0.9;
    }

    .hero-description {
        font-size: 1.125rem;
        margin: 0 0 2rem 0;
        opacity: 0.8;
        line-height: 1.6;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .features {
        margin-bottom: 4rem;
    }

    .features h2 {
        text-align: center;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 3rem 0;
        color: var(--primary);
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
    }

    .feature {
        text-align: center;
        padding: 1rem;
    }

    .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .feature h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .feature p {
        color: var(--tertiary);
        line-height: 1.6;
        margin: 0;
    }

    .quick-start {
        margin-bottom: 4rem;
    }

    .quick-start h2 {
        text-align: center;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 3rem 0;
        color: var(--primary);
    }

    .quick-start-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .quick-action {
        text-align: center;
        padding: 1rem;
    }

    .quick-action-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .quick-action h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .quick-action p {
        color: var(--tertiary);
        line-height: 1.6;
        margin: 0;
    }

    @media (max-width: 768px) {
        .home {
            padding: 1rem;
        }

        .hero {
            padding: 2rem 1rem;
        }

        .hero h1 {
            font-size: 2.5rem;
        }

        .hero-subtitle {
            font-size: 1.25rem;
        }

        .hero-actions {
            flex-direction: column;
            align-items: center;
        }

        .features-grid,
        .quick-start-grid {
            grid-template-columns: 1fr;
        }
    }
</style>