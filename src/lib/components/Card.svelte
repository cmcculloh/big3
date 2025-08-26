<script>
	import { createEventDispatcher } from 'svelte';

	export let padding = 'medium'; // 'small', 'medium', 'large'
	export let elevation = 'medium'; // 'low', 'medium', 'high'
	export let clickable = false;
	export let selected = false;

	// Forward click events
	function handleClick(event) {
		if (clickable) {
			dispatch('click', event);
		}
	}

	const dispatch = createEventDispatcher();
</script>

<div
	class="card card-{elevation} card-padding-{padding}"
	class:card-clickable={clickable}
	class:card-selected={selected}
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && clickable && handleClick(e)}
	role={clickable ? 'button' : undefined}
>
	<slot />
</div>

<style>
	.card {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	/* Elevation variants */
	.card-low {
		box-shadow: var(--shadow-md);
	}

	.card-medium {
		box-shadow: var(--shadow-lg);
	}

	.card-high {
		box-shadow: var(--shadow-xl);
	}

	/* Padding variants */
	.card-padding-small {
		padding: 0.75rem;
	}

	.card-padding-medium {
		padding: 1.5rem;
	}

	.card-padding-large {
		padding: 2rem;
	}

	/* Clickable state */
	.card-clickable {
		cursor: pointer;
	}

	.card-clickable:hover {
		/* No hover effects */
	}

	.card-clickable:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	/* Selected state */
	.card-selected {
		border-color: var(--primary);
		background: rgba(10, 36, 99, 0.05);
	}

	.card-selected.card-clickable:hover {
		background: rgba(10, 36, 99, 0.1);
	}
</style>
