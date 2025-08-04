<ul>
	<li><a>Option</a></li>
	<li><a>Option</a></li>
	<li><a>Option</a></li>
	<li><a>Option</a></li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 1rem;
		border-radius: 0.5rem;
		background-color: var(--tertiary);
		list-style-type: none;
	}

	li {
		border-bottom: 1px solid var(--subtle);

		&:last-child {
			border-bottom: 0 none;
		}

		& a {
			color: var(--subtle);
			display: block;
			padding: 1rem 0 1rem 1rem;
			position: relative;
			text-decoration: none;
			background-color: var(--background);
			font-weight: 500;

			&::after {
				content: '';
				position: absolute;
				right: 1rem;
				top: 50%;
				transform: translateY(-50%);
				width: 1em;
				height: 1em;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath style='fill:%23e2e2e2' d='M7.05 4.55a1 1 0 011.4 0L13.5 10l-5.05 5.45a1 1 0 11-1.4-1.4L10.6 10 7.05 5.95a1 1 0 010-1.4z'/%3E%3C/svg%3E");
				background-repeat: no-repeat;
				background-size: contain;
				color: var(--subtle);
			}
		}
	}
</style>
