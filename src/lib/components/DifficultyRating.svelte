<script>
	import { createEventDispatcher } from 'svelte';

	export let value = null; // '😊', '😐', '☹️'
	export let disabled = false;
	export let size = 'medium'; // 'small', 'medium', 'large'

	const dispatch = createEventDispatcher();

	const options = [
		{ emoji: '😊', label: 'Easy', value: '😊' },
		{ emoji: '😐', label: 'Just Right', value: '😐' },
		{ emoji: '☹️', label: 'Too Hard', value: '☹️' }
	];

	function selectDifficulty(option) {
		if (disabled) return;

		value = option.value;
		dispatch('change', { value: option.value, label: option.label });
	}
</script>

<div class="difficulty-rating difficulty-{size}">
	<div class="difficulty-label">How was this exercise?</div>

	<div class="difficulty-options">
		{#each options as option}
			<button
				class="difficulty-option"
				class:selected={value === option.value}
				class:disabled={disabled}
				on:click={() => selectDifficulty(option)}
				{disabled}
				title={option.label}
			>
				<span class="difficulty-emoji">{option.emoji}</span>
				<span class="difficulty-text">{option.label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.difficulty-rating {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.difficulty-small {
		gap: 0.5rem;
	}

	.difficulty-medium {
		gap: 1rem;
	}

	.difficulty-large {
		gap: 1.5rem;
	}

	.difficulty-label {
		font-weight: 600;
		color: var(--primary);
		text-align: center;
	}

	.difficulty-small .difficulty-label {
		font-size: 0.875rem;
	}

	.difficulty-medium .difficulty-label {
		font-size: 1rem;
	}

	.difficulty-large .difficulty-label {
		font-size: 1.125rem;
	}

	.difficulty-options {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.difficulty-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem;
		border: 2px solid var(--subtle);
		border-radius: 0.75rem;
		background-color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 80px;
	}

	.difficulty-option:hover:not(.disabled) {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.difficulty-option.selected {
		border-color: var(--primary);
		background-color: var(--primary);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(10, 36, 99, 0.3);
	}

	.difficulty-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.difficulty-option.disabled:hover {
		transform: none;
		box-shadow: none;
	}

	.difficulty-emoji {
		font-size: 1.5rem;
		line-height: 1;
	}

	.difficulty-small .difficulty-emoji {
		font-size: 1.25rem;
	}

	.difficulty-large .difficulty-emoji {
		font-size: 2rem;
	}

	.difficulty-text {
		font-size: 0.75rem;
		font-weight: 500;
		text-align: center;
	}

	.difficulty-small .difficulty-text {
		font-size: 0.625rem;
	}

	.difficulty-large .difficulty-text {
		font-size: 0.875rem;
	}

	.difficulty-option:focus {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
