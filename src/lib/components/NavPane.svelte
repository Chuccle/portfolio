<script lang="ts">
	import { session } from '$lib/state/session.svelte';
	import type { Region } from '$lib/terminal/types';

	interface NavItem {
		label: string;
		command: string;
		region: Region;
		hint: string;
	}

	/**
	 * The typed interface is the point of the site, but nobody should be
	 * forced to use it. Every section is one click away here.
	 */
	const items: NavItem[] = [
		{ label: 'Overview', command: '!analyze -v', region: 'home', hint: '!analyze -v' },
		{ label: 'Experience', command: 'k', region: 'stack', hint: 'k' },
		{ label: 'Skills', command: 'lm', region: 'modules', hint: 'lm' },
		{ label: 'Projects', command: '!process 0 0', region: 'platter', hint: '!process 0 0' },
		{ label: 'Education', command: 'dt _QUALIFICATIONS', region: 'heap', hint: 'dt' },
		{ label: 'Contact', command: '!contact', region: 'contact', hint: '!contact' }
	];
</script>

<nav class="pane bevel-in" aria-label="Sections">
	<header class="pane-title">Call Stack</header>
	<ul>
		{#each items as item (item.command)}
			<li>
				<button
					type="button"
					class:active={session.region === item.region}
					onclick={() => session.run(item.command)}
				>
					<span class="label">{item.label}</span>
					<span class="hint">{item.hint}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.pane {
		background: var(--bg-panel);
		flex-shrink: 0;
	}

	.pane-title {
		padding: 0.3rem 0.65rem;
		font-family: var(--ui);
		font-size: 0.8rem;
		color: var(--phosphor-dim);
		background: var(--bg-chrome);
		border-bottom: 1px solid var(--bevel-lo);
		user-select: none;
	}

	ul {
		padding: 0.3rem;
	}

	button {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1ch;
		width: 100%;
		padding: 0.3rem 0.55rem;
		border-left: 2px solid transparent;
		transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
	}

	button:hover {
		background: var(--bg-chrome);
	}

	button.active {
		background: var(--bg-inset);
		border-left-color: var(--key);
	}

	.label {
		color: var(--phosphor);
	}

	button.active .label {
		color: var(--phosphor-hi);
	}

	.hint {
		color: var(--phosphor-faint);
		font-size: 0.85em;
	}

	/* On narrow viewports the nav becomes a horizontal, thumb-scrollable strip. */
	@media (max-width: 720px) {
		.pane-title {
			display: none;
		}

		ul {
			display: flex;
			gap: 2px;
			overflow-x: auto;
			overflow-y: hidden;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
			padding: 0;
		}

		ul::-webkit-scrollbar {
			display: none;
		}

		li {
			flex: 0 0 auto;
		}

		button {
			border-left: none;
			border-bottom: 2px solid transparent;
			padding: 0.7rem 0.9rem;
			min-height: 44px;
		}

		button.active {
			border-bottom-color: var(--key);
		}

		.hint {
			display: none;
		}
	}
</style>
