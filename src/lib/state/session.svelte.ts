import { browser } from '$app/environment';
import { bootSequence } from '$lib/terminal/boot';
import { dispatch } from '$lib/terminal/commands';
import { dim, s } from '$lib/terminal/format';
import type { Line, Region } from '$lib/terminal/types';
import { viewMode } from './viewMode.svelte';

export type Phase = 'booting' | 'ready';

/** A line in the transcript, plus the metadata the renderer needs. */
export interface Entry {
	id: number;
	line: Line;
	/** Echoed user input renders with a prompt glyph. */
	echo?: boolean;
}

const prefersReducedMotion = () =>
	browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class Session {
	entries = $state<Entry[]>([]);
	history = $state<string[]>([]);
	input = $state('');
	phase = $state<Phase>('booting');
	region = $state<Region>('home');
	busy = $state(false);
	bugchecked = $state(false);
	/** True once boot() has run at least once — re-opening the terminal later
	 *  resumes where it was left rather than replaying the intro every time. */
	started = $state(false);
	/** Narrow-viewport flag. Commands render a different, non-tabular layout. */
	compact = $state(false);
	/** Bumped on each command so the scene can pulse in response. */
	pulse = $state(0);

	#nextId = 0;
	#historyIndex = -1;
	#timers = new Set<ReturnType<typeof setTimeout>>();
	#lastCommand = '!analyze -v';
	#printing = false;

	constructor() {
		if (!browser) return;
		const query = window.matchMedia('(max-width: 720px)');
		this.compact = query.matches;
		query.addEventListener('change', (e) => {
			const changed = this.compact !== e.matches;
			this.compact = e.matches;
			// Re-render the current view in its new layout rather than leaving
			// a desktop-shaped table stranded on a phone after a rotate.
			if (changed && this.phase === 'ready') this.#relayout();
		});
	}

	#push(line: Line, echo = false) {
		this.entries.push({ id: this.#nextId++, line, echo });
	}

	#later(fn: () => void, ms: number) {
		const t = setTimeout(() => {
			this.#timers.delete(t);
			fn();
		}, ms);
		this.#timers.add(t);
		return t;
	}

	#cancelTimers() {
		for (const t of this.#timers) clearTimeout(t);
		this.#timers.clear();
	}

	/* ---------------- boot ---------------- */

	boot(force = false) {
		if (this.started && !force) return;
		this.started = true;
		this.#cancelTimers();
		this.entries = [];
		this.phase = 'booting';
		this.busy = true;

		if (prefersReducedMotion()) {
			for (const step of bootSequence) this.#push(step.line);
			this.#finishBoot();
			return;
		}

		let elapsed = 0;
		for (const step of bootSequence) {
			elapsed += step.delay;
			this.#later(() => this.#push(step.line), elapsed);
		}
		this.#later(() => this.#finishBoot(), elapsed + 120);
	}

	/** Jump straight to the prompt, e.g. when the visitor presses a key. */
	skipBoot() {
		if (this.phase !== 'booting') return;
		this.#cancelTimers();
		this.entries = [];
		for (const step of bootSequence) this.#push(step.line);
		this.#finishBoot();
	}

	#finishBoot() {
		this.phase = 'ready';
		this.busy = false;
		this.run('!analyze -v', { echo: false });
	}

	/**
	 * Re-renders the last command's output for the current breakpoint, without
	 * touching history or re-triggering side effects (print, reboot, bugcheck).
	 * A viewport change — including the one `window.print()` itself can cause
	 * in some browsers — must never replay a one-shot action like `.dump`.
	 */
	#relayout() {
		this.#cancelTimers();
		const result = dispatch(this.#lastCommand, this.compact);
		this.entries = [];
		if (result.region) this.region = result.region;
		this.#stream(result.lines);
	}

	/* ---------------- commands ---------------- */

	run(raw: string, options: { echo?: boolean; clear?: boolean } = {}) {
		const command = raw.trim();
		if (!command) return;

		this.#cancelTimers();
		this.#lastCommand = command;

		if (options.clear) this.entries = [];

		if (options.echo !== false) {
			this.#push({ spans: [s(command)] }, true);
		}

		if (command !== this.history.at(-1)) this.history.push(command);
		this.#historyIndex = -1;

		const result = dispatch(command, this.compact);

		if (result.clear) this.entries = [];
		if (result.region) this.region = result.region;
		if (result.bugcheck) this.bugchecked = true;
		this.pulse++;

		if (result.reboot) {
			this.#later(() => this.boot(true), 400);
			return;
		}

		if (result.print && browser && !this.#printing) {
			// Printing always happens from the clean, readable page — not the
			// debugger chrome — so leave the terminal before invoking it. Guarded
			// so nothing (a stray re-render, a resize while the dialog is open)
			// can queue up a second print behind this one.
			this.#printing = true;
			this.#later(() => {
				viewMode.exitTerminal();
				this.#later(() => {
					window.print();
					this.#printing = false;
				}, 120);
			}, 240);
		}

		this.#stream(result.lines);
	}

	/** Reveals output progressively, but never takes longer than ~450ms. */
	#stream(lines: Line[]) {
		if (lines.length === 0) return;

		if (prefersReducedMotion()) {
			for (const l of lines) this.#push(l);
			return;
		}

		this.busy = true;
		const step = Math.min(14, Math.max(3, 450 / lines.length));
		lines.forEach((l, i) => {
			this.#later(() => {
				this.#push(l);
				if (i === lines.length - 1) this.busy = false;
			}, step * i);
		});
	}

	submit() {
		const value = this.input;
		this.input = '';
		if (!value.trim()) {
			this.#push({ spans: [] }, true);
			return;
		}
		this.run(value);
	}

	/* ---------------- history ---------------- */

	historyPrev() {
		if (this.history.length === 0) return;
		if (this.#historyIndex === -1) this.#historyIndex = this.history.length - 1;
		else this.#historyIndex = Math.max(0, this.#historyIndex - 1);
		this.input = this.history[this.#historyIndex];
	}

	historyNext() {
		if (this.#historyIndex === -1) return;
		this.#historyIndex++;
		if (this.#historyIndex >= this.history.length) {
			this.#historyIndex = -1;
			this.input = '';
		} else {
			this.input = this.history[this.#historyIndex];
		}
	}

	/** Appends a line without running anything — used by tab completion. */
	note(line: Line) {
		this.#push(line);
	}

	clear() {
		this.#cancelTimers();
		this.entries = [];
		this.busy = false;
		this.#push({ spans: [dim('Command window cleared.')] });
	}

	dismissBugcheck() {
		this.bugchecked = false;
	}
}

export const session = new Session();
