<script>
    import Nav from '$lib/components/nav.svelte';
    import AIAssistant from '$lib/components/AIAssistant.svelte';
    import Card from '$lib/components/Card.svelte';
    import { onMount } from 'svelte';

    let userHistory = null;
    let currentRoutine = null;
    let loading = true;

    // Mock user history for demonstration
    const mockHistory = [
        {
            id: 1,
            routineName: 'Upper Body Strength',
            startedAt: '2024-01-15T10:30:00',
            duration: 45,
            exercises: [
                { name: 'Push-ups', sets: 3, reps: 10, weight: null, difficulty: '😐' },
                { name: 'Dumbbell Rows', sets: 3, reps: 12, weight: 25, difficulty: '😊' },
                { name: 'Plank Hold', sets: 3, duration: 30, weight: null, difficulty: '☹️' }
            ]
        },
        {
            id: 2,
            routineName: 'Cardio Circuit',
            startedAt: '2024-01-12T09:00:00',
            duration: 35,
            exercises: [
                { name: 'Jumping Jacks', sets: 3, duration: 60, weight: null, difficulty: '😐' },
                { name: 'Burpees', sets: 3, reps: 10, weight: null, difficulty: '☹️' }
            ]
        }
    ];

    onMount(() => {
        // Simulate loading user data
        setTimeout(() => {
            userHistory = mockHistory;
            loading = false;
        }, 500);
    });

    function handleSaveWorkout(event) {
        const { workout } = event.detail;
        // Here you would save the workout to the database
        console.log('Saving AI-generated workout:', workout);
        alert('Workout saved! You can find it in your routines.');
    }
</script>

<Nav />

<main class="ai-page">
    <div class="ai-header">
        <div class="ai-title">
            <h1>🤖 AI Workout Assistant</h1>
            <p>Your personal AI trainer for creating and optimizing workouts</p>
        </div>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading your workout data...</p>
        </div>
    {:else}
        <div class="ai-content">
            <!-- AI Assistant -->
            <AIAssistant
                {userHistory}
                {currentRoutine}
                on:saveWorkout={handleSaveWorkout}
            />

            <!-- AI Features Overview -->
            <div class="ai-features">
                <h2>What I Can Do For You</h2>
                <div class="features-grid">
                    <Card class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <h3>Create Custom Workouts</h3>
                        <p>Tell me your goals, available time, and equipment, and I'll design a personalized workout routine just for you.</p>
                        <div class="feature-example">
                            <strong>Example:</strong> "Create a 30-minute upper body workout using only dumbbells"
                        </div>
                    </Card>

                    <Card class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>Quick Workouts</h3>
                        <p>Need a workout right now? Tell me how much time you have and what you want to focus on.</p>
                        <div class="feature-example">
                            <strong>Example:</strong> "I have 17 minutes and want to focus on legs"
                        </div>
                    </Card>

                    <Card class="feature-card">
                        <div class="feature-icon">🔄</div>
                        <h3>Optimize Routines</h3>
                        <p>I'll analyze your existing workouts and suggest improvements based on your performance history.</p>
                        <div class="feature-example">
                            <strong>Example:</strong> "Make my upper body routine more challenging"
                        </div>
                    </Card>

                    <Card class="feature-card">
                        <div class="feature-icon">💡</div>
                        <h3>Exercise Substitutions</h3>
                        <p>Don't have the right equipment or want to try something new? I'll suggest perfect alternatives.</p>
                        <div class="feature-example">
                            <strong>Example:</strong> "I can't do push-ups, what else can I do?"
                        </div>
                    </Card>

                    <Card class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Performance Analysis</h3>
                        <p>I'll analyze your workout data to identify trends and suggest improvements for better results.</p>
                        <div class="feature-example">
                            <strong>Example:</strong> "How am I progressing with my strength training?"
                        </div>
                    </Card>

                    <Card class="feature-card">
                        <div class="feature-icon">🎨</div>
                        <h3>Smart Adjustments</h3>
                        <p>I'll automatically adjust weights, reps, and rest periods based on your difficulty ratings and progress.</p>
                        <div class="feature-example">
                            <strong>Example:</strong> "Adjust my routine based on my recent performance"
                        </div>
                    </Card>
                </div>
            </div>

            <!-- Tips Section -->
            <Card class="tips-section">
                <h2>💡 Tips for Better AI Results</h2>
                <div class="tips-grid">
                    <div class="tip">
                        <h4>Be Specific</h4>
                        <p>Instead of "leg workout", try "30-minute leg workout focusing on quads and glutes with dumbbells"</p>
                    </div>
                    <div class="tip">
                        <h4>Include Equipment</h4>
                        <p>Tell me what equipment you have: "I only have resistance bands and a yoga mat"</p>
                    </div>
                    <div class="tip">
                        <h4>Mention Goals</h4>
                        <p>Share your fitness goals: "I want to build strength for rock climbing"</p>
                    </div>
                    <div class="tip">
                        <h4>Rate Your Workouts</h4>
                        <p>Use the 😊😐☹️ ratings so I can learn your preferences and adjust accordingly</p>
                    </div>
                </div>
            </Card>
        </div>
    {/if}
</main>

<style>
    .ai-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .ai-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .ai-title h1 {
        font-size: 3rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .ai-title p {
        font-size: 1.25rem;
        color: var(--tertiary);
        margin: 0;
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
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .ai-content {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .ai-features h2 {
        font-size: 2rem;
        font-weight: 600;
        margin: 0 0 2rem 0;
        color: var(--primary);
        text-align: center;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }

    .feature-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
    }

    .feature-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }

    .feature-card h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: var(--primary);
    }

    .feature-card p {
        color: var(--tertiary);
        line-height: 1.6;
        margin: 0;
    }

    .feature-example {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
        font-size: 0.875rem;
        text-align: left;
    }

    .tips-section {
        padding: 2rem;
    }

    .tips-section h2 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 2rem 0;
        color: var(--primary);
        text-align: center;
    }

    .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .tip {
        padding: 1.5rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
    }

    .tip h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }

    .tip p {
        font-size: 0.875rem;
        color: var(--tertiary);
        margin: 0;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .ai-page {
            padding: 1rem;
        }

        .ai-title h1 {
            font-size: 2rem;
        }

        .ai-title p {
            font-size: 1rem;
        }

        .features-grid {
            grid-template-columns: 1fr;
        }

        .tips-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
