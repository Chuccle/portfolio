import type { Line, Span, Tone } from './types';

/* Span constructors ------------------------------------------------- */

export const s = (text: string, tone?: Tone): Span => ({ text, tone });
export const dim = (text: string): Span => ({ text, tone: 'dim' });
export const faint = (text: string): Span => ({ text, tone: 'faint' });
export const hi = (text: string): Span => ({ text, tone: 'hi', bold: true });
export const cyan = (text: string): Span => ({ text, tone: 'cyan' });
export const green = (text: string): Span => ({ text, tone: 'green' });
export const amber = (text: string): Span => ({ text, tone: 'amber' });
export const red = (text: string): Span => ({ text, tone: 'red' });
export const magenta = (text: string): Span => ({ text, tone: 'magenta' });

export const link = (text: string, href: string): Span => ({ text, href, tone: 'cyan' });
export const cmd = (text: string, command: string): Span => ({ text, cmd: command, tone: 'cyan' });

/* Line constructors ------------------------------------------------- */

export const line = (...spans: Span[]): Line => ({ spans });
export const blank = (): Line => ({ spans: [] });
export const text = (value: string, tone?: Tone): Line => ({ spans: [s(value, tone)] });

/** Body copy: wraps softly, hangs at `indent`, rendered less starkly. */
export const prose = (value: string, indent = 2): Line => ({
	spans: [s(value)],
	indent,
	prose: true
});

export const indented = (indent: number, ...spans: Span[]): Line => ({ spans, indent });

/** Pads to a fixed column width so tables line up in a monospace grid. */
export const pad = (value: string, width: number): string =>
	value.length >= width ? value : value + ' '.repeat(width - value.length);

export const padStart = (value: string, width: number): string =>
	value.length >= width ? value : ' '.repeat(width - value.length) + value;

/** The banner WinDbg prints around `!analyze -v` output. */
export function banner(title: string, width = 79): Line[] {
	const bar = '*'.repeat(width);
	const inner = (content: string) => {
		const room = width - 2;
		const left = Math.floor((room - content.length) / 2);
		const right = room - content.length - left;
		return '*' + ' '.repeat(Math.max(0, left)) + content + ' '.repeat(Math.max(0, right)) + '*';
	};
	return [
		text(bar, 'faint'),
		text(inner(''), 'faint'),
		line(faint('*'), s(inner(title).slice(1, -1), 'amber'), faint('*')),
		text(inner(''), 'faint'),
		text(bar, 'faint')
	];
}

/** A `KEY: value` row with the key padded to a consistent column. */
export function field(key: string, value: Span[] | string, keyWidth = 20): Line {
	const spans: Span[] = [dim(pad(key + ':', keyWidth))];
	if (typeof value === 'string') spans.push(s(value));
	else spans.push(...value);
	return { spans, indent: keyWidth };
}

export function rule(label?: string, width = 79): Line[] {
	if (!label) return [text('-'.repeat(width), 'faint')];
	const lead = '--- ';
	const tail = ' ' + '-'.repeat(Math.max(0, width - lead.length - label.length - 1));
	return [line(faint(lead), s(label.toUpperCase(), 'amber'), faint(tail))];
}
