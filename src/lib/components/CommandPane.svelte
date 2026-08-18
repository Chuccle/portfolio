<script lang="ts">
	import { session } from '$lib/state/session.svelte';
	import { completions } from '$lib/terminal/commands';
	import { dim } from '$lib/terminal/format';
	import OutputLine from './OutputLine.svelte';
	import { tick } from 'svelte';

	let scroller = $state<HTMLDivElement | undefined>();
	let field = $state<HTMLInputElement | undefined>();
	let pinned = true;

	/** Stick to the bottom unless the visitor has scrolled up to read. */
	function onScroll() {
		if (!scroller) return;
		const slack = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
		pinned = slack < 48;
	}

	function scrollToBottom() {
		tick().then(() => {
			if (!scroller) return;
			// Explicitly instant: the container's CSS scroll-behavior is smooth,
			// and animating this write means onScroll sees the in-flight lag as
			// "the visitor scrolled up" and cancels the pin mid-animation.
			scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'instant' });
		});
	}

	// Running a command is always an explicit request to see its output —
	// it re-pins the view even if the visitor had scrolled up to read
	// something earlier, exactly like a real terminal.
	$effect(() => {
		session.pulse;
		pinned = true;
		scrollToBottom();
	});

	// As output streams in line by line, keep following it — but only while
	// still pinned, so scrolling up mid-stream to read isn't fought.
	$effect(() => {
		session.entries.length;
		if (!pinned) return;
		scrollToBottom();
	});

	$effect(() => {
		// Autofocus only when there's a real keyboard to type with — on touch
		// devices this would otherwise pop the virtual keyboard unasked.
		if (session.phase === 'ready' && window.matchMedia('(pointer: fine)').matches) {
			field?.focus();
		}
	});

	function complete() {
		const value = session.input.trim();
		if (!value) return;
		const matches = completions.filter((c) => c.startsWith(value));
		if (matches.length === 0) return;
		if (matches.length === 1) {
			session.input = matches[0] + ' ';
		} else {
			// Fill in the longest shared prefix, then list the candidates.
			let prefix = matches[0];
			for (const m of matches) {
				while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
			}
			session.input = prefix;
			session.note({ spans: [dim(matches.join('   '))], indent: 2 });
		}
	}

	function onKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				session.submit();
				break;
			case 'ArrowUp':
				event.preventDefault();
				session.historyPrev();
				break;
			case 'ArrowDown':
				event.preventDefault();
				session.historyNext();
				break;
			case 'Tab':
				event.preventDefault();
				complete();
				break;
			case 'l':
				if (event.ctrlKey) {
					event.preventDefault();
					session.clear();
				}
				break;
			case 'c':
				if (event.ctrlKey && !window.getSelection()?.toString()) {
					event.preventDefault();
					session.input = '';
				}
				break;
		}
	}
</script>

<!--
	Clicking dead space in the transcript returns focus to the prompt — a mouse
	convenience only. Keyboard users reach the input directly in the tab order,
	so there is no keyboard behaviour to mirror here.
-->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	class="pane bevel-in"
	aria-label="Debugger command window"
	onclick={(event) => {
		if (window.getSelection()?.toString()) return;
		if ((event.target as HTMLElement).closest('a, button')) return;
		field?.focus();
	}}
>
	<header class="pane-title">
		<span class="dot"></span>
		Command
		<span class="spacer"></span>
		<span class="meta">{session.entries.length} lines</span>
	</header>

	<div class="scroller" bind:this={scroller} onscroll={onScroll} role="log" aria-live="polite">
		{#each session.entries as entry (entry.id)}
			<OutputLine line={entry.line} echo={entry.echo} />
		{/each}

		{#if session.phase === 'ready'}
			<div class="input-row">
				<span class="prompt">kd&gt;</span>
				<input
					bind:this={field}
					bind:value={session.input}
					onkeydown={onKeydown}
					type="text"
					inputmode="text"
					spellcheck="false"
					autocomplete="off"
					autocapitalize="off"
					autocorrect="off"
					enterkeyhint="go"
					aria-label="Debugger command input. Type .help for a list of commands."
				/>
			</div>
		{/if}
	</div>
</section>

<style>
	.pane {
		display: flex;
		flex-direction: column;
		min-height: 0;
		background: var(--bg-inset);
	}

	.pane-title {
		display: flex;
		align-items: center;
		gap: 0.7ch;
		padding: 0.3rem 0.65rem;
		font-family: var(--ui);
		font-size: 0.8rem;
		color: var(--phosphor-dim);
		background: var(--bg-chrome);
		border-bottom: 1px solid var(--bevel-lo);
		user-select: none;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ok);
	}

	.spacer {
		flex: 1;
	}

	.meta {
		color: var(--phosphor-faint);
		font-variant-numeric: tabular-nums;
	}

	.scroller {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		padding: 0.85rem 1rem 1rem;
		padding-bottom: max(1rem, env(safe-area-inset-bottom));
		scroll-behavior: smooth;
	}

	.input-row {
		display: flex;
		align-items: baseline;
		gap: 0.6ch;
		padding-top: 0.3rem;
	}

	.prompt {
		color: var(--ok);
		user-select: none;
	}

	input {
		flex: 1;
		min-width: 0;
		background: none;
		border: none;
		outline: none;
		font: inherit;
		color: var(--phosphor-hi);
		caret-color: var(--accent);
		padding: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.scroller {
			scroll-behavior: auto;
		}
	}

	/* Below 16px, iOS Safari zooms the page on focus. The input alone gets
	   bumped to the zoom-safe floor; transcript text stays compact. */
	@media (max-width: 720px) {
		input {
			font-size: max(1em, 16px);
		}
	}
</style>
