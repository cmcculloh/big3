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

    // Auto-complete state
    let autoCompleteSuggestions = [];
    let showAutoComplete = false;
    let currentSuggestionType = '';
    let promptBuilder = {
        overallTask: '',
        duration: '',
        targetAreas: [],
        workoutType: '',
        equipmentType: '',
        include: []
    };

    // Suggestion categories
    const suggestionTypes = [
        { key: 'overallTask', label: 'What do you want to do?', icon: '🎯' },
        { key: 'duration', label: 'How much time?', icon: '⏱️' },
        { key: 'targetAreas', label: 'Target areas?', icon: '💪' },
        { key: 'workoutType', label: 'Workout type?', icon: '🏋️' },
        { key: 'equipmentType', label: 'Equipment?', icon: '🏋️‍♂️' },
        { key: 'include', label: 'Include?', icon: '➕' }
    ];

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

Start typing what you want, and I'll help you build the perfect prompt!`,
            timestamp: new Date()
        }];
    }

    // Watch for changes in currentMessage to trigger auto-complete
    $: if (currentMessage.trim()) {
        handleAutoComplete(currentMessage);
    } else {
        showAutoComplete = false;
        autoCompleteSuggestions = [];
    }

    async function handleAutoComplete(input) {
        if (!input.trim()) {
            showAutoComplete = false;
            return;
        }

        // Determine what type of suggestion to show based on current input
        const suggestionType = determineSuggestionType(input);

        if (suggestionType !== currentSuggestionType) {
            currentSuggestionType = suggestionType;
            await fetchAutoCompleteSuggestions(input, suggestionType);
        }
    }

    function determineSuggestionType(input) {
        const lowerInput = input.toLowerCase();

        // Check if we're still building the initial request
        if (!promptBuilder.overallTask) {
            return 'overallTask';
        }

        // Check if we need duration
        if (!promptBuilder.duration && !lowerInput.includes('minute') && !lowerInput.includes('hour')) {
            return 'duration';
        }

        // Check if we need target areas
        if (promptBuilder.targetAreas.length === 0 && !lowerInput.includes('body') && !lowerInput.includes('arm') && !lowerInput.includes('leg')) {
            return 'targetAreas';
        }

        // Check if we need workout type
        if (!promptBuilder.workoutType && !lowerInput.includes('strength') && !lowerInput.includes('cardio') && !lowerInput.includes('yoga')) {
            return 'workoutType';
        }

        // Check if we need equipment
        if (!promptBuilder.equipmentType && !lowerInput.includes('dumbbell') && !lowerInput.includes('barbell') && !lowerInput.includes('bodyweight')) {
            return 'equipmentType';
        }

        // Check if we need include elements
        if (promptBuilder.include.length === 0) {
            return 'include';
        }

        return 'complete';
    }

    async function fetchAutoCompleteSuggestions(input, type) {
        try {
            const response = await fetch('/api/ai/auto-complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input,
                    type,
                    currentPrompt: buildCurrentPrompt(),
                    userHistory
                })
            });

            if (response.ok) {
                const data = await response.json();
                autoCompleteSuggestions = data.suggestions || [];
                showAutoComplete = autoCompleteSuggestions.length > 0;
            } else {
                // Fallback to static suggestions if API fails
                autoCompleteSuggestions = getStaticSuggestions(type);
                showAutoComplete = autoCompleteSuggestions.length > 0;
            }
        } catch (error) {
            console.warn('Auto-complete API failed, using static suggestions:', error);
            autoCompleteSuggestions = getStaticSuggestions(type);
            showAutoComplete = autoCompleteSuggestions.length > 0;
        }
    }

    function getStaticSuggestions(type) {
        switch (type) {
            case 'overallTask':
                return [
                    { text: 'Create a new workout routine', action: 'replace' },
                    { text: 'Optimize my existing routine', action: 'replace' },
                    { text: 'Generate a quick workout', action: 'replace' },
                    { text: 'Suggest exercise substitutions', action: 'replace' }
                ];
            case 'duration':
                return [
                    { text: '30 minutes', action: 'append' },
                    { text: '45 minutes', action: 'append' },
                    { text: '1 hour', action: 'append' },
                    { text: '20 minutes', action: 'append' }
                ];
            case 'targetAreas':
                return [
                    { text: 'upper body', action: 'append' },
                    { text: 'lower body', action: 'append' },
                    { text: 'full body', action: 'append' },
                    { text: 'core', action: 'append' }
                ];
            case 'workoutType':
                return [
                    { text: 'strength training', action: 'append' },
                    { text: 'cardio', action: 'append' },
                    { text: 'yoga', action: 'append' },
                    { text: 'HIIT', action: 'append' }
                ];
            case 'equipmentType':
                return [
                    { text: 'dumbbells', action: 'append' },
                    { text: 'bodyweight only', action: 'append' },
                    { text: 'resistance bands', action: 'append' },
                    { text: 'full gym equipment', action: 'append' }
                ];
            case 'include':
                return [
                    { text: 'warmup exercises', action: 'append' },
                    { text: 'cool-down stretches', action: 'append' },
                    { text: 'cardio elements', action: 'append' },
                    { text: 'strength training', action: 'append' }
                ];
            default:
                return [];
        }
    }

    function buildCurrentPrompt() {
        let prompt = '';

        if (promptBuilder.overallTask) {
            prompt += promptBuilder.overallTask;
        }

        if (promptBuilder.duration) {
            prompt += ` for ${promptBuilder.duration}`;
        }

        if (promptBuilder.targetAreas.length > 0) {
            prompt += ` focusing on ${promptBuilder.targetAreas.join(', ')}`;
        }

        if (promptBuilder.workoutType) {
            prompt += ` using ${promptBuilder.workoutType}`;
        }

        if (promptBuilder.equipmentType) {
            prompt += ` with ${promptBuilder.equipmentType}`;
        }

        if (promptBuilder.include.length > 0) {
            prompt += `. Include: ${promptBuilder.include.join(', ')}`;
        }

        return prompt.trim();
    }

    function selectSuggestion(suggestion) {
        if (suggestion.action === 'replace') {
            currentMessage = suggestion.text;
            updatePromptBuilder(currentSuggestionType, suggestion.text);
        } else if (suggestion.action === 'append') {
            currentMessage += ` ${suggestion.text}`;
            updatePromptBuilder(currentSuggestionType, suggestion.text);
        }

        showAutoComplete = false;
        autoCompleteSuggestions = [];
    }

    function updatePromptBuilder(type, value) {
        switch (type) {
            case 'overallTask':
                promptBuilder.overallTask = value;
                break;
            case 'duration':
                promptBuilder.duration = value;
                break;
            case 'targetAreas':
                if (!promptBuilder.targetAreas.includes(value)) {
                    promptBuilder.targetAreas = [...promptBuilder.targetAreas, value];
                }
                break;
            case 'workoutType':
                promptBuilder.workoutType = value;
                break;
            case 'equipmentType':
                promptBuilder.equipmentType = value;
                break;
            case 'include':
                if (!promptBuilder.include.includes(value)) {
                    promptBuilder.include = [...promptBuilder.include, value];
                }
                break;
        }
        promptBuilder = { ...promptBuilder }; // Trigger reactivity
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
        showAutoComplete = false;

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

    async function saveWorkout(workoutData, event) {
        try {
            // Show saving state
            const saveButton = event?.target || event?.currentTarget;
            if (saveButton) {
                const originalText = saveButton.textContent;
                saveButton.textContent = '💾 Saving...';
                saveButton.disabled = true;
            }

            // Save the workout via API
            const response = await fetch('/api/ai/save-workout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workout: workoutData })
            });

            const data = await response.json();

            if (data.success) {
                // Show success message briefly
                addAIMessage(`Great! I've saved "${workoutData.name}" as a new routine. Redirecting you to view it...`);

                // Redirect to the newly created routine after a short delay
                setTimeout(() => {
                    window.location.href = `/routines/${data.routine.id}`;
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to save workout');
            }
        } catch (error) {
            console.error('Error saving workout:', error);
            addAIMessage(`Sorry, I couldn't save the workout. Error: ${error.message}`);

            // Reset button state if we have a reference
            const saveButton = event?.target || event?.currentTarget;
            if (saveButton) {
                saveButton.textContent = '💾 Save as Routine';
                saveButton.disabled = false;
            }
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        } else if (event.key === 'Escape') {
            showAutoComplete = false;
            autoCompleteSuggestions = [];
        }
    }

    function showQuickWorkoutForm() {
        showQuickWorkout = true;
        addAIMessage('I can create a quick workout for you! How much time do you have and what would you like to focus on?');
    }

    function clearPromptBuilder() {
        promptBuilder = {
            overallTask: '',
            duration: '',
            targetAreas: [],
            workoutType: '',
            equipmentType: '',
            include: []
        };
        currentMessage = '';
        showAutoComplete = false;
        autoCompleteSuggestions = [];
    }
</script>

<Card class="ai-assistant">
    <div class="ai-header">
        <h3>🤖 AI Workout Assistant</h3>
        <div class="ai-actions">
            <Button variant="secondary" size="small" on:click={showQuickWorkoutForm}>
                ⚡ Quick Workout
            </Button>
            <Button variant="secondary" size="small" on:click={clearPromptBuilder}>
                🗑️ Clear
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

                                    <Button variant="primary" size="small" on:click={(event) => saveWorkout(message.workoutData, event)}>
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

        <!-- Auto-complete Suggestions -->
        {#if showAutoComplete && autoCompleteSuggestions.length > 0}
            <div class="auto-complete-container">
                <div class="auto-complete-header">
                    <span class="suggestion-type">
                        {suggestionTypes.find(s => s.key === currentSuggestionType)?.icon}
                        {suggestionTypes.find(s => s.key === currentSuggestionType)?.label}
                    </span>
                </div>
                <div class="auto-complete-suggestions">
                    {#each autoCompleteSuggestions as suggestion}
                        <button
                            class="auto-complete-suggestion"
                            on:click={() => selectSuggestion(suggestion)}
                        >
                            {suggestion.text}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Prompt Builder Progress -->
        {#if Object.values(promptBuilder).some(v => v && (Array.isArray(v) ? v.length > 0 : true))}
            <div class="prompt-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {Math.min(100, (Object.values(promptBuilder).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length / 6) * 100)}%"></div>
                </div>
                <span class="progress-text">
                    Building your prompt... {Object.values(promptBuilder).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length} of 6 sections
                </span>
            </div>
        {/if}

        <div class="input-container">
            <textarea
                bind:value={currentMessage}
                on:keydown={handleKeydown}
                placeholder="Start typing what you want... I'll help you build the perfect prompt!"
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
                    <label for="quick-time">Time Available (minutes)</label>
                    <input
                        id="quick-time"
                        type="number"
                        bind:value={quickWorkoutTime}
                        min="10"
                        max="120"
                        class="form-input"
                    />
                </div>
                <div class="form-group">
                    <label for="quick-focus">Focus Area</label>
                    <select id="quick-focus" bind:value={quickWorkoutFocus} class="form-select">
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
        border-bottom: 2px solid var(--subtle);
        margin-bottom: 1rem;
    }

    .ai-header h3 {
        margin: 0;
        color: var(--primary);
        font-size: 1.25rem;
    }

    .ai-actions {
        display: flex;
        gap: 0.5rem;
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
        background-color: var(--gray-50);
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

    /* Auto-complete Styles */
    .auto-complete-container {
        background: white;
        border: 1px solid var(--subtle);
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin: 0 1rem;
    }

    .auto-complete-header {
        background-color: var(--subtle);
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--subtle);
    }

    .suggestion-type {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary);
    }

    .auto-complete-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 1rem;
    }

    .auto-complete-suggestion {
        padding: 0.5rem 1rem;
        background: white;
        border: 1px solid var(--subtle);
        border-radius: 1.5rem;
        color: var(--primary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .auto-complete-suggestion:hover {
        /* No hover effects */
    }

    /* Prompt Progress Styles */
    .prompt-progress {
        margin: 0 1rem;
        padding: 1rem;
        background-color: var(--blue-50);
        border-radius: 0.5rem;
        border: 1px solid var(--blue-200);
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: var(--subtle);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background-color: var(--primary);
        border-radius: 4px;
        transition: width 0.3s ease-in-out;
    }

    .progress-text {
        font-size: 0.875rem;
        color: var(--tertiary);
        text-align: center;
        display: block;
    }

    .input-container {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
        padding: 0 1rem;
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
        background-color: var(--green-50);
        border-radius: 0.5rem;
        border-left: 4px solid var(--green-500);
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
        background-color: var(--amber-50);
        border-radius: 0.5rem;
        border: 1px solid var(--amber-200);
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

        .auto-complete-suggestions {
            flex-direction: column;
        }

        .auto-complete-suggestion {
            text-align: center;
        }
    }
</style>
