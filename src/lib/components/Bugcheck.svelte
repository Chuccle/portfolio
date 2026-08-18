<script lang="ts">
	import { session } from '$lib/state/session.svelte';
	import { onMount } from 'svelte';

	let percent = $state(0);
	let dismissButton = $state<HTMLButtonElement | undefined>();

	// Move focus into the overlay so Escape and Enter reach it immediately.
	$effect(() => {
		dismissButton?.focus();
	});

	onMount(() => {
		const timer = setInterval(() => {
			percent = Math.min(100, percent + Math.ceil(Math.random() * 9));
			if (percent >= 100) clearInterval(timer);
		}, 220);
		return () => clearInterval(timer);
	});

	function dismiss() {
		session.dismissBugcheck();
		session.run('!analyze -v');
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' || event.key === 'Enter') dismiss();
	}}
/>

<div
	class="bsod"
	role="alertdialog"
	aria-modal="true"
	aria-label="Simulated bugcheck screen"
	tabindex="-1"
>
	<div class="inner">
		<p class="face">:(</p>
		<p class="lede">
			Your PC ran into a problem and needs to restart. We're just collecting some error info, and
			then we'll restart for you.
		</p>
		<p class="progress">{percent}% complete</p>

		<div class="detail">
			<div class="qr" aria-hidden="true">
				{#each Array(36) as _, i (i)}
					<span class:on={(i * 7 + (i % 5) * 3) % 4 !== 0}></span>
				{/each}
			</div>
			<div class="detail-text">
				<p>For more information about this issue and possible fixes, visit</p>
				<p class="url">github.com/Chuccle</p>
				<p class="stop">
					If you call a support person, give them this info:<br />
					Stop code: <strong>CV_STILL_LOOKS_GOOD</strong>
				</p>
			</div>
		</div>

		<button type="button" bind:this={dismissButton} onclick={dismiss}>
			Press Esc to continue
		</button>
	</div>
</div>

<style>
	.bsod {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		background: #0059b3;
		color: #fff;
		font-family: var(--ui);
		padding: 6vh 8vw;
		animation: flash var(--dur) var(--ease);
	}

	@keyframes flash {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.inner {
		max-width: 46rem;
		width: 100%;
	}

	.face {
		font-size: clamp(4rem, 11vw, 8rem);
		line-height: 1;
		font-weight: 300;
	}

	.lede {
		margin-top: 2rem;
		font-size: clamp(1rem, 2.2vw, 1.5rem);
		line-height: 1.4;
		max-width: 36ch;
	}

	.progress {
		margin-top: 1.6rem;
		font-size: clamp(1rem, 2.2vw, 1.5rem);
		font-variant-numeric: tabular-nums;
	}

	.detail {
		display: flex;
		gap: 1.4rem;
		margin-top: 2.4rem;
		align-items: flex-start;
	}

	.qr {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 2px;
		width: 5.5rem;
		flex-shrink: 0;
		background: #fff;
		padding: 4px;
	}

	.qr span {
		aspect-ratio: 1;
		background: #fff;
	}

	.qr span.on {
		background: #0059b3;
	}

	.detail-text {
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.url {
		margin-top: 0.2rem;
		opacity: 0.85;
	}

	.stop {
		margin-top: 1rem;
	}

	button {
		margin-top: 2.6rem;
		padding: 0.5rem 1.1rem;
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 2px;
		color: #fff;
		font-family: var(--ui);
		font-size: 0.9rem;
	}

	button:hover {
		background: rgba(255, 255, 255, 0.14);
	}
</style>
