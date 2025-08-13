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
		background: rgba(255, 255, 255, 0.95);
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	/* Elevation variants */
	.card-low {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.card-medium {
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.card-high {
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15);
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
		transform: translateY(-4px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15);
	}

	.card-clickable:focus {
		outline: 2px solid #667eea;
		outline-offset: 2px;
	}

	/* Selected state */
	.card-selected {
		border-color: #667eea;
		background: rgba(102, 126, 234, 0.05);
	}

	.card-selected.card-clickable:hover {
		background: rgba(102, 126, 234, 0.1);
	}
</style>
