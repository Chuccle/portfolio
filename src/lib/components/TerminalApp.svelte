<script lang="ts">
	import Bugcheck from './Bugcheck.svelte';
	import CommandPane from './CommandPane.svelte';
	import NavPane from './NavPane.svelte';
	import RegistersPane from './RegistersPane.svelte';
	import StatusBar from './StatusBar.svelte';
	import TitleBar from './TitleBar.svelte';
	import { session } from '$lib/state/session.svelte';
	import { viewMode } from '$lib/state/viewMode.svelte';
	import { onMount } from 'svelte';

	/**
	 * This entire component — chrome and the command session state machine —
	 * only exists once a visitor explicitly opts into it. Nobody pays for any
	 * of this by default.
	 */
	let windowEl = $state<HTMLDivElement>();
	let fullscreen = $state(false);

	onMount(() => {
		session.boot();

		const onFullscreenChange = () => {
			fullscreen = document.fullscreenElement === windowEl;
		};
		document.addEventListener('fullscreenchange', onFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
	});

	function skip() {
		if (session.phase === 'booting') session.skipBoot();
	}

	function exit() {
		if (document.fullscreenElement) document.exitFullscreen();
		viewMode.exitTerminal();
	}

	function toggleFullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			windowEl?.requestFullscreen().catch(() => {
				// Some browsers (or a denied permission) simply won't grant
				// fullscreen — the window is already generously sized, so
				// there's nothing further to do about it.
			});
		}
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && !document.fullscreenElement) {
			exit();
			return;
		}
		skip();
	}}
/>

<main class="desktop" onpointerdown={skip}>
	<div class="window bevel-out" bind:this={windowEl} class:fullscreen>
		<TitleBar onExit={exit} {fullscreen} onToggleFullscreen={toggleFullscreen} />

		<div class="body">
			<CommandPane />

			<div class="dock">
				<NavPane />
				<RegistersPane />
			</div>
		</div>

		<StatusBar />

		<!--
			Rendered inside .window, not as a page-level sibling: the Fullscreen
			API promotes .window to the browser's top layer when maximized, which
			renders above everything outside it regardless of z-index. A sibling
			overlay would be silently buried behind the fullscreened window.
		-->
		{#if session.bugchecked}
			<Bugcheck />
		{/if}
	</div>

	{#if session.phase === 'booting'}
		<p class="skip-hint">press any key to skip</p>
	{/if}
</main>

<style>
	.desktop {
		position: fixed;
		inset: 0;
		z-index: 50;
		height: 100dvh;
		display: grid;
		place-items: center;
		padding: clamp(4px, 0.8vw, 14px);
		background: var(--bg-void);
	}

	.window {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: 0;
		background: var(--bg-shell);
		box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.7);
		overflow: hidden;
	}

	/* True OS fullscreen — the browser chrome itself disappears too. */
	.window.fullscreen {
		box-shadow: none;
	}

	.body {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 20rem;
		gap: 2px;
		padding: 2px;
		background: var(--border);
	}

	.dock {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-height: 0;
		min-width: 0;
	}

	.skip-hint {
		position: absolute;
		bottom: max(1.2rem, env(safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		color: var(--phosphor-faint);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		pointer-events: none;
		animation: fade 2.4s ease-in-out infinite;
	}

	@keyframes fade {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 0.8;
		}
	}

	@media (max-width: 720px) {
		.desktop {
			padding: 0;
			padding-top: env(safe-area-inset-top);
			padding-bottom: env(safe-area-inset-bottom);
		}

		.body {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto minmax(0, 1fr);
		}

		.dock {
			order: -1;
			flex-direction: row;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skip-hint {
			animation: none;
		}
	}
</style>
