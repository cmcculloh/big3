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
		transition: all 0.3s ease;
		text-decoration: none;
		font-family: inherit;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s ease;
	}

	.btn:hover::before {
		left: 100%;
	}

	.btn:focus {
		outline: 2px solid #667eea;
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Variants */
	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
	}

	.btn-secondary {
		background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
		color: white;
	}

	.btn-secondary:hover:not(:disabled) {
		background: linear-gradient(135deg, #5a5a5a 0%, #3f3f3f 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
	}

	.btn-success {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: linear-gradient(135deg, #059669 0%, #047857 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
	}

	.btn-danger {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
	}

	.btn-ghost {
		background: transparent;
		color: #667eea;
		border: 2px solid #667eea;
		box-shadow: none;
	}

	.btn-ghost:hover:not(:disabled) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
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
