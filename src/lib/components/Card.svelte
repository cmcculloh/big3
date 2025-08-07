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
	tabindex={clickable ? 0 : undefined}
>
	<slot />
</div>

<style>
	.card {
		background-color: white;
		border-radius: 0.75rem;
		border: 1px solid var(--subtle);
		transition: all 0.2s ease;
	}

	/* Elevation variants */
	.card-low {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.card-medium {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.card-high {
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
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
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.card-clickable:focus {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Selected state */
	.card-selected {
		border-color: var(--primary);
		background-color: #f8fafc;
	}

	.card-selected.card-clickable:hover {
		background-color: #f1f5f9;
	}
</style>
