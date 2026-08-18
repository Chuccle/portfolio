<script lang="ts">
	import { identity, meta } from '$lib/data/cv';
	import { session } from '$lib/state/session.svelte';

	let {
		onExit,
		fullscreen = false,
		onToggleFullscreen
	}: { onExit: () => void; fullscreen?: boolean; onToggleFullscreen: () => void } = $props();

	const menus = ['File', 'Edit', 'View', 'Debug', 'Window', 'Help'];

	const menuCommand: Record<string, string> = {
		File: '.dump',
		Edit: '.cls',
		View: 'lm',
		Debug: '!analyze -v',
		Window: '!teb',
		Help: '.help'
	};
</script>

<div class="titlebar">
	<span class="icon" aria-hidden="true">kd</span>
	<h1>
		{identity.name}
		<span class="dim">— KERNEL: {meta.target} — WinDbg</span>
	</h1>
	<div class="controls">
		<button type="button" class="box" onclick={onToggleFullscreen}>
			<span aria-hidden="true">{fullscreen ? '❐' : '□'}</span>
			<span class="sr-only">{fullscreen ? 'Restore window size' : 'Maximize to fullscreen'}</span>
		</button>
		<button type="button" class="box close" onclick={onExit}>
			<span aria-hidden="true">×</span>
			<span class="sr-only">Exit terminal mode, back to the normal page</span>
		</button>
	</div>
</div>

<div class="menubar">
	{#each menus as menu (menu)}
		<button type="button" onclick={() => session.run(menuCommand[menu])}>{menu}</button>
	{/each}
	<span class="spacer"></span>
	<span class="state" class:running={session.busy}>
		{session.busy ? 'Running' : 'Break'}
	</span>
</div>

<style>
	.titlebar {
		display: flex;
		align-items: center;
		gap: 0.7ch;
		padding: 0.35rem 0.55rem;
		background: var(--bg-chrome);
		font-family: var(--ui);
		user-select: none;
	}

	.icon {
		display: grid;
		place-items: center;
		width: 1.3rem;
		height: 1.3rem;
		background: var(--bg-inset);
		box-shadow:
			inset 1px 1px 0 var(--bevel-lo),
			inset -1px -1px 0 var(--bevel-hi);
		color: var(--key);
		font-family: var(--mono);
		font-size: 0.62rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	h1 {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--phosphor-hi);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dim {
		font-weight: 400;
		color: var(--phosphor-dim);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 3px;
		margin-left: auto;
		flex-shrink: 0;
	}

	.box {
		display: grid;
		place-items: center;
		position: relative;
		width: 20px;
		height: 18px;
		font-size: 0.7rem;
		line-height: 1;
		color: var(--phosphor-dim);
		background: var(--bg-chrome);
		box-shadow:
			inset 1px 1px 0 var(--bevel-hi),
			inset -1px -1px 0 var(--bevel-lo);
		transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
	}

	/* These are real buttons; give them a hit area that clears the 44px
	   touch-target guideline without growing the visible glyph. */
	.box::after {
		content: '';
		position: absolute;
		inset: -13px -13px;
	}

	.box:hover,
	.box:focus-visible {
		color: var(--phosphor-hi);
		background: var(--bg-chrome-hi);
	}

	button.close {
		color: var(--bad);
	}

	button.close:hover,
	button.close:focus-visible {
		color: var(--bad);
		background: color-mix(in oklab, var(--bad) 22%, var(--bg-chrome));
	}

	.menubar {
		display: flex;
		align-items: center;
		gap: 1px;
		padding: 0.15rem 0.4rem;
		background: var(--bg-chrome);
		border-top: 1px solid var(--bevel-hi);
		font-family: var(--ui);
		font-size: 0.8rem;
	}

	.menubar button {
		padding: 0.2rem 0.6rem;
		color: var(--phosphor-dim);
	}

	.menubar button:hover {
		background: var(--bg-chrome-hi);
		color: var(--phosphor-hi);
	}

	.spacer {
		flex: 1;
	}

	.state {
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--key);
		padding-right: 0.4rem;
	}

	.state.running {
		color: var(--ok);
	}

	@media (max-width: 720px) {
		h1 .dim {
			display: none;
		}

		.menubar button:nth-child(n + 4) {
			display: none;
		}
	}
</style>
