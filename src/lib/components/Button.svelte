<script>
	import { createEventDispatcher } from 'svelte';

	export let variant = 'primary'; // 'primary', 'secondary', 'success', 'danger', 'ghost'
	export let size = 'medium'; // 'small', 'medium', 'large'
	export let disabled = false;
	export let type = 'button';
	export let fullWidth = false;
	export let href = null;

	// Forward click events
	function handleClick(event) {
		if (!disabled) {
			dispatch('click', event);
		}
	}

	const dispatch = createEventDispatcher();
</script>

{#if href}
	<a
		href={href}
		class="btn btn-{variant} btn-{size}"
		class:btn-full-width={fullWidth}
		class:btn-disabled={disabled}
		{disabled}
		on:click={handleClick}
		on:keydown={(e) => e.key === 'Enter' && !disabled && handleClick(e)}
	>
		<slot />
	</a>
{:else}
	<button
		class="btn btn-{variant} btn-{size}"
		class:btn-full-width={fullWidth}
		class:btn-disabled={disabled}
		{disabled}
		{type}
		on:click={handleClick}
		on:keydown={(e) => e.key === 'Enter' && !disabled && handleClick(e)}
	>
		<slot />
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
		font-family: inherit;
	}

	.btn:focus {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Variants */
	.btn-primary {
		background-color: var(--primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #081f4a;
		transform: translateY(-1px);
	}

	.btn-secondary {
		background-color: var(--tertiary);
		color: white;
	}

	.btn-secondary:hover:not(:disabled) {
		background-color: #4a4a4a;
		transform: translateY(-1px);
	}

	.btn-success {
		background-color: #10b981;
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background-color: #059669;
		transform: translateY(-1px);
	}

	.btn-danger {
		background-color: var(--secondary);
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background-color: #dc2626;
		transform: translateY(-1px);
	}

	.btn-ghost {
		background-color: transparent;
		color: var(--primary);
		border: 2px solid var(--primary);
	}

	.btn-ghost:hover:not(:disabled) {
		background-color: var(--primary);
		color: white;
		transform: translateY(-1px);
	}

	/* Sizes */
	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.btn-medium {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	.btn-large {
		padding: 1rem 2rem;
		font-size: 1.125rem;
	}

	/* Full width */
	.btn-full-width {
		width: 100%;
	}

	/* Disabled state */
	.btn-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-disabled:hover {
		transform: none !important;
	}
</style>
