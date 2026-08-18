<script lang="ts">
	import { session } from '$lib/state/session.svelte';
	import type { Line } from '$lib/terminal/types';

	let { line, echo = false }: { line: Line; echo?: boolean } = $props();

	const indent = $derived(line.indent ?? 0);
</script>

<div
	class="line"
	class:prose={line.prose}
	style:padding-left={indent ? `${indent}ch` : undefined}
	style:text-indent={indent && !line.prose ? `-${indent}ch` : undefined}
>
	{#if echo}<span class="prompt">kd&gt;</span>{/if}{#each line.spans as span, i (i)}{#if span.href}<a
				href={span.href}
				target={span.href.startsWith('mailto:') ? undefined : '_blank'}
				rel="noopener noreferrer">{span.text}</a
			>{:else if span.cmd}<button
				type="button"
				class="cmd"
				onclick={() => session.run(span.cmd!)}>{span.text}</button
			>{:else}<span class={span.tone ?? 'default'} class:bold={span.bold}>{span.text}</span
			>{/if}{/each}
</div>

<style>
	.line {
		white-space: pre-wrap;
		overflow-wrap: break-word;
		min-height: 1.55em;
	}

	.prose {
		white-space: pre-wrap;
		color: var(--phosphor);
		max-width: 82ch;
		text-wrap: pretty;
	}

	.prompt {
		color: var(--ok);
		user-select: none;
		margin-right: 0.6ch;
	}

	.default {
		color: var(--phosphor);
	}
	.dim {
		color: var(--phosphor-dim);
	}
	.faint {
		color: var(--phosphor-faint);
	}
	.hi {
		color: var(--phosphor-hi);
	}
	.cyan,
	.blue {
		color: var(--accent);
	}
	.green {
		color: var(--ok);
	}
	.amber {
		color: var(--key);
	}
	.red {
		color: var(--bad);
	}
	.magenta {
		color: var(--alt);
	}
	.bold {
		font-weight: 700;
	}

	a {
		color: var(--accent);
	}

	.cmd {
		color: var(--accent);
		font: inherit;
		border-bottom: 1px dotted color-mix(in oklab, var(--accent) 55%, transparent);
		transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
	}

	.cmd:hover {
		color: var(--phosphor-hi);
		background: color-mix(in oklab, var(--accent) 16%, transparent);
	}

	/* Larger hit area for fat fingers, without disturbing the running text. */
	@media (max-width: 720px) {
		.cmd {
			padding: 0.15rem 0;
			margin: -0.15rem 0;
		}
	}
</style>
