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
		border-radius: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		font-family: inherit;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	/* Removed shimmery animation */

	.btn:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Variants */
	.btn-primary {
		background: linear-gradient(135deg, var(--cerulean) 0%, var(--royal-blue-traditional) 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--hover-primary) 0%, var(--blue-600) 100%);
	}

	.btn-secondary {
		background: linear-gradient(135deg, var(--davys-gray) 0%, var(--royal-blue-traditional) 100%);
		color: white;
	}

	.btn-secondary:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--hover-secondary) 0%, var(--gray-700) 100%);
	}

	.btn-success {
		background: linear-gradient(135deg, var(--success) 0%, var(--cerulean) 100%);
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--success-light) 0%, var(--success-dark) 100%);
	}

	.btn-danger {
		background: linear-gradient(135deg, var(--secondary) 0%, var(--imperial-red) 100%);
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--danger-light) 0%, var(--danger-dark) 100%);
	}

	.btn-ghost {
		background: transparent;
		color: var(--primary);
		border: 2px solid var(--primary);
		box-shadow: none;
	}

	.btn-ghost:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--hover-accent) 0%, var(--teal-600) 100%);
		color: white;
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
		/* No hover effects for disabled buttons */
	}
</style>
