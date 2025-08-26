<script>
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let duration = 60; // in seconds
	export let autoStart = false;
	export let showControls = true;
	export let size = 'large'; // 'small', 'medium', 'large'

	const dispatch = createEventDispatcher();

	let timeLeft = duration;
	let isRunning = false;
	let interval;
	let audioContext;
	let oscillator;

	// Initialize audio context for sound
	onMount(() => {
		if (typeof window !== 'undefined') {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
		if (audioContext) audioContext.close();
	});

	function startTimer() {
		if (isRunning) return;

		isRunning = true;
		dispatch('start');

		interval = setInterval(() => {
			timeLeft--;

			if (timeLeft <= 0) {
				stopTimer();
				playSound();
				dispatch('complete');
			} else if (timeLeft <= 3) {
				playSound();
			}
		}, 1000);
	}

	function pauseTimer() {
		if (!isRunning) return;

		isRunning = false;
		clearInterval(interval);
		dispatch('pause');
	}

	function stopTimer() {
		isRunning = false;
		clearInterval(interval);
		timeLeft = duration;
		dispatch('stop');
	}

	function resetTimer() {
		stopTimer();
		timeLeft = duration;
		dispatch('reset');
	}

	function playSound() {
		if (!audioContext) return;

		try {
			oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.5);
		} catch (error) {
			console.warn('Could not play sound:', error);
		}
	}

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	// Auto-start if requested
	$: if (autoStart && !isRunning && timeLeft === duration) {
		startTimer();
	}

	// Update timeLeft when duration changes
	$: if (duration !== timeLeft && !isRunning) {
		timeLeft = duration;
	}
</script>

<div class="timer timer-{size}">
	<div class="timer-display">
		<span class="timer-time" class:warning={timeLeft <= 10} class:danger={timeLeft <= 3}>
			{formatTime(timeLeft)}
		</span>
	</div>

	{#if showControls}
		<div class="timer-controls">
			{#if !isRunning}
				<button class="timer-btn timer-btn-start" on:click={startTimer}>
					▶️ Start
				</button>
			{:else}
				<button class="timer-btn timer-btn-pause" on:click={pauseTimer}>
					⏸️ Pause
				</button>
			{/if}

			<button class="timer-btn timer-btn-reset" on:click={resetTimer}>
				🔄 Reset
			</button>
		</div>
	{/if}
</div>

<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 1rem;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		color: white;
		text-align: center;
	}

	.timer-small {
		padding: 1rem;
	}

	.timer-medium {
		padding: 1.5rem;
	}

	.timer-large {
		padding: 2rem;
	}

	.timer-display {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timer-time {
		font-family: 'Courier New', monospace;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.timer-small .timer-time {
		font-size: 1.5rem;
	}

	.timer-medium .timer-time {
		font-size: 2rem;
	}

	.timer-large .timer-time {
		font-size: 3rem;
	}

	.timer-time.warning {
		color: var(--warning);
		animation: pulse 1s infinite;
	}

	.timer-time.danger {
		color: var(--secondary);
		animation: pulse 0.5s infinite;
	}

	.timer-controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.timer-btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.5rem;
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s ease;
		backdrop-filter: blur(10px);
	}

	.timer-btn:hover {
		/* No hover effects */
	}

	.timer-btn:active {
		transform: translateY(0);
	}

	.timer-btn-start {
		background-color: rgba(20, 184, 129, 0.8);
	}

	.timer-btn-start:hover {
		background-color: rgba(20, 184, 129, 1);
	}

	.timer-btn-pause {
		background-color: rgba(245, 158, 11, 0.8);
	}

	.timer-btn-pause:hover {
		background-color: rgba(245, 158, 11, 1);
	}

	.timer-btn-reset {
		background-color: rgba(107, 114, 128, 0.8);
	}

	.timer-btn-reset:hover {
		background-color: rgba(107, 114, 128, 1);
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
