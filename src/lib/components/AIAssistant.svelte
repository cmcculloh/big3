<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';
    import Card from './Card.svelte';

    export let userHistory = null;
    export let currentRoutine = null;

    const dispatch = createEventDispatcher();

    let messages = [];
    let currentMessage = '';
    let isLoading = false;
    let showQuickWorkout = false;
    let quickWorkoutTime = 30;
    let quickWorkoutFocus = 'full body';

    const focusOptions = [
        'full body', 'upper body', 'lower body', 'core', 'cardio',
        'strength', 'flexibility', 'arms', 'legs', 'back', 'chest'
    ];

    // Initialize with welcome message
    $: if (messages.length === 0) {
        messages = [{
            type: 'ai',
            content: `Hi! I'm your AI workout assistant. I can help you:

🎯 Create custom workout routines
⚡ Generate quick workouts based on your time
🔄 Optimize your existing routines
💡 Suggest exercise replacements
📊 Analyze your performance

What would you like to do today?`,
            timestamp: new Date()
        }];
    }

    async function sendMessage() {
        if (!currentMessage.trim() || isLoading) return;

        const userMessage = {
            type: 'user',
            content: currentMessage,
            timestamp: new Date()
        };

        messages = [...messages, userMessage];
        const messageToSend = currentMessage;
        currentMessage = '';
        isLoading = true;

        try {
            // Determine the type of request and call appropriate API
            if (messageToSend.toLowerCase().includes('quick') || messageToSend.toLowerCase().includes('time')) {
                await handleQuickWorkoutRequest(messageToSend);
            } else if (messageToSend.toLowerCase().includes('optimize') || messageToSend.toLowerCase().includes('improve')) {
                await handleOptimizationRequest(messageToSend);
            } else {
                await handleGeneralRequest(messageToSend);
            }
        } catch (error) {
            addAIMessage(`Sorry, I encountered an error: ${error.message}. Please try again.`);
        } finally {
            isLoading = false;
        }
    }

    async function handleQuickWorkoutRequest(request) {
        // Extract time and focus from request
        const timeMatch = request.match(/(\d+)\s*(?:min|minutes?|mins?)/i);
        const time = timeMatch ? parseInt(timeMatch[1]) : 30;

        const focusMatch = request.match(/(?:focus on|target|workout for)\s+([^.]+)/i);
        const focus = focusMatch ? focusMatch[1].trim() : 'full body';

        const response = await fetch('/api/ai/quick-workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timeAvailable: time,
                focus: focus,
                userHistory
            })
        });

        const data = await response.json();

        if (data.success) {
            const workout = data.workout;
            addAIMessage(`I've created a ${time}-minute ${focus} workout for you! Here's what I've planned:

**${workout.name}**
${workout.description}

**Duration:** ${workout.estimatedDuration} minutes
**Exercises:** ${workout.exercises.length} exercises

${workout.aiNotes}

Would you like me to save this as a new routine?`, workout);
        } else {
            addAIMessage(`I couldn't generate a workout right now. Please try again or be more specific about your time and focus area.`);
        }
    }

    async function handleOptimizationRequest(request) {
        if (!currentRoutine) {
            addAIMessage(`I'd be happy to help optimize a workout! Please select a routine first, or tell me what specific improvements you're looking for.`);
            return;
        }

        const response = await fetch('/api/ai/optimize-workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                routine: currentRoutine,
                userHistory,
                optimizationRequest: request
            })
        });

        const data = await response.json();

        if (data.success) {
            const optimization = data.optimization;
            let message = `I've analyzed your routine and here are my recommendations:\n\n`;

            if (optimization.optimizations && optimization.optimizations.length > 0) {
                message += `**Optimizations:**\n`;
                optimization.optimizations.forEach((opt, index) => {
                    message += `${index + 1}. **${opt.type}**: ${opt.suggestion}\n   *Reason: ${opt.reason}*\n\n`;
                });
            }

            message += optimization.aiNotes || '';

            addAIMessage(message, optimization.newRoutine);
        } else {
            addAIMessage(`I couldn't optimize your workout right now. Please try again with more specific feedback.`);
        }
    }

    async function handleGeneralRequest(request) {
        const response = await fetch('/api/ai/generate-workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                request,
                userHistory
            })
        });

        const data = await response.json();

        if (data.success) {
            const workout = data.workout;
            addAIMessage(`I've created a workout based on your request! Here's what I've planned:

**${workout.name}**
${workout.description}

**Duration:** ${workout.estimatedDuration} minutes
**Category:** ${workout.category}
**Exercises:** ${workout.exercises.length} exercises

${workout.aiNotes}

Would you like me to save this as a new routine?`, workout);
        } else {
            addAIMessage(`I couldn't generate a workout right now. Please try again with a more specific request.`);
        }
    }

    function addAIMessage(content, workoutData = null) {
        const aiMessage = {
            type: 'ai',
            content,
            timestamp: new Date(),
            workoutData
        };

        messages = [...messages, aiMessage];
    }

    function saveWorkout(workoutData) {
        dispatch('saveWorkout', { workout: workoutData });
        addAIMessage('Great! I\'ve saved the workout to your routines. You can find it in your routine list.');
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    function showQuickWorkoutForm() {
        showQuickWorkout = true;
        addAIMessage('I can create a quick workout for you! How much time do you have and what would you like to focus on?');
    }
</script>

<Card class="ai-assistant">
    <div class="ai-header">
        <h3>🤖 AI Workout Assistant</h3>
        <div class="ai-actions">
            <Button variant="secondary" size="small" on:click={showQuickWorkoutForm}>
                ⚡ Quick Workout
            </Button>
        </div>
    </div>

    <div class="chat-container">
        <div class="messages">
            {#each messages as message}
                <div class="message message-{message.type}">
                    <div class="message-content">
                        {#if message.type === 'ai'}
                            <div class="ai-avatar">🤖</div>
                        {:else}
                            <div class="user-avatar">👤</div>
                        {/if}
                        <div class="message-text">
                            {message.content}

                            {#if message.workoutData}
                                <div class="workout-preview">
                                    <h4>Generated Workout Preview:</h4>
                                    <p><strong>{message.workoutData.name}</strong></p>
                                    <p>{message.workoutData.description}</p>
                                    <p>Duration: {message.workoutData.estimatedDuration} minutes</p>
                                    <p>Exercises: {message.workoutData.exercises?.length || 0}</p>

                                    <Button variant="primary" size="small" on:click={() => saveWorkout(message.workoutData)}>
                                        💾 Save as Routine
                                    </Button>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="message-time">
                        {message.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            {/each}

            {#if isLoading}
                <div class="message message-ai">
                    <div class="message-content">
                        <div class="ai-avatar">🤖</div>
                        <div class="message-text">
                            <div class="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <div class="input-container">
            <textarea
                bind:value={currentMessage}
                on:keydown={handleKeydown}
                placeholder="Ask me to create a workout, optimize your routine, or suggest exercises..."
                class="message-input"
                rows="2"
                disabled={isLoading}
            ></textarea>
            <Button
                variant="primary"
                size="small"
                on:click={sendMessage}
                disabled={!currentMessage.trim() || isLoading}
            >
                {isLoading ? '⏳' : '📤'}
            </Button>
        </div>
    </div>

    {#if showQuickWorkout}
        <div class="quick-workout-form">
            <h4>⚡ Quick Workout Generator</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Time Available (minutes)</label>
                    <input
                        type="number"
                        bind:value={quickWorkoutTime}
                        min="10"
                        max="120"
                        class="form-input"
                    />
                </div>
                <div class="form-group">
                    <label>Focus Area</label>
                    <select bind:value={quickWorkoutFocus} class="form-select">
                        {#each focusOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <Button
                variant="primary"
                on:click={() => {
                    currentMessage = `Create a ${quickWorkoutTime}-minute ${quickWorkoutFocus} workout`;
                    showQuickWorkout = false;
                    sendMessage();
                }}
            >
                🏃 Generate Workout
            </Button>
        </div>
    {/if}
</Card>

<style>
    .ai-assistant {
        display: flex;
        flex-direction: column;
        height: 600px;
        max-width: 800px;
        margin: 0 auto;
    }

    .ai-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--subtle);
        margin-bottom: 1rem;
    }

    .ai-header h3 {
        margin: 0;
        color: var(--primary);
        font-size: 1.25rem;
    }

    .chat-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 1rem;
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        max-height: 400px;
    }

    .message {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .message-ai {
        align-items: flex-start;
    }

    .message-user {
        align-items: flex-end;
    }

    .message-content {
        display: flex;
        gap: 0.75rem;
        max-width: 80%;
    }

    .message-user .message-content {
        flex-direction: row-reverse;
    }

    .ai-avatar,
    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .ai-avatar {
        background-color: var(--primary);
        color: white;
    }

    .user-avatar {
        background-color: var(--accent);
        color: white;
    }

    .message-text {
        background-color: white;
        padding: 0.75rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        white-space: pre-wrap;
        line-height: 1.5;
    }

    .message-user .message-text {
        background-color: var(--primary);
        color: white;
    }

    .message-time {
        font-size: 0.75rem;
        color: var(--tertiary);
        margin-left: 40px;
    }

    .message-user .message-time {
        margin-left: 0;
        margin-right: 40px;
        text-align: right;
    }

    .input-container {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
    }

    .message-input {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid var(--subtle);
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 0.875rem;
        resize: none;
        transition: border-color 0.2s ease;
    }

    .message-input:focus {
        outline: none;
        border-color: var(--primary);
    }

    .message-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .typing-indicator {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--tertiary);
        animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .workout-preview {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f0f9ff;
        border-radius: 0.5rem;
        border-left: 4px solid var(--accent);
    }

    .workout-preview h4 {
        margin: 0 0 0.5rem 0;
        color: var(--primary);
        font-size: 1rem;
    }

    .workout-preview p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
    }

    .quick-workout-form {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border: 1px solid var(--subtle);
    }

    .quick-workout-form h4 {
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .form-group label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary);
    }

    .form-input,
    .form-select {
        padding: 0.5rem;
        border: 1px solid var(--subtle);
        border-radius: 0.25rem;
        font-size: 0.875rem;
    }

    .form-input:focus,
    .form-select:focus {
        outline: none;
        border-color: var(--primary);
    }

    @media (max-width: 768px) {
        .ai-assistant {
            height: 500px;
        }

        .message-content {
            max-width: 90%;
        }

        .form-row {
            flex-direction: column;
        }

        .input-container {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>
