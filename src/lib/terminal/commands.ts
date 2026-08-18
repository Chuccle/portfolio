import { achievements, identity, meta, projects, qualifications, roles, skillModules } from '$lib/data/cv';
import {
	amber,
	banner,
	blank,
	cmd,
	cyan,
	dim,
	faint,
	field,
	green,
	hi,
	indented,
	line,
	link,
	magenta,
	pad,
	prose,
	red,
	rule,
	s,
	text
} from './format';
import type { Command, CommandResult, Line, Span } from './types';

const role = roles[0];

/** Rule/banner width: a phone gets a narrower page. */
const ruleWidth = (compact: boolean) => (compact ? 34 : 79);

/**
 * A labelled value. Wide screens get the classic aligned two-column form;
 * narrow ones stack the label above the value so nothing wraps mid-column.
 */
function kv(key: string, value: Span[], compact: boolean, keyWidth = 20): Line[] {
	if (!compact) return [field(key, value, keyWidth)];
	return [line(dim(key + ':')), indented(2, s('  '), ...value)];
}

/* ------------------------------------------------------------------ */
/* !analyze -v — the landing view                                     */
/* ------------------------------------------------------------------ */

const analyze: Command = {
	name: '!analyze',
	aliases: ['analyze', '!analyze -v'],
	synopsis: 'Full analysis of the target: who this is, and what he has shipped.',
	group: 'cv',
	region: 'home',
	run({ compact }) {
		const width = ruleWidth(compact);
		const out: Line[] = [
			...banner('Bugcheck Analysis', width),
			blank(),
			line(s('CHARLIE_COHEN_SOFTWARE_ENGINEER', 'red'), dim(' (0x00000001)')),
			blank(),
			prose(identity.statement, 0),
			blank(),
			...kv('TARGET', [s(meta.target, 'hi')], compact),
			...kv(
				'ROLE',
				[
					s(role.title, 'hi'),
					dim(', '),
					s(role.company),
					dim('  ('),
					s(role.period, 'green'),
					dim(')')
				],
				compact
			),
			...kv('SYMBOLS', [link(identity.github, identity.githubUrl)], compact),
			...kv('CONTACT', [cmd('run !contact', '!contact')], compact),
			blank(),
			...rule('key achievements', width),
			blank()
		];

		for (const a of achievements) {
			out.push(...kv('FAULTING_CONDITION', [s(a.code, 'red')], compact));
			out.push(indented(2, s('  '), hi(a.title)));
			out.push(prose(a.body, 2));
			out.push(...kv('PROBABLY_CAUSED_BY', [s(a.impact, 'green')], compact));
			out.push(blank());
		}

		out.push(...rule('next', width));
		out.push(blank());
		out.push(
			indented(2, dim('  Run '), cmd('k', 'k'), dim(' for the call stack (experience), ')),
		);
		out.push(
			indented(
				2,
				dim('  '),
				cmd('lm', 'lm'),
				dim(' for loaded modules (skills), '),
				cmd('!process 0 0', '!process 0 0'),
				dim(' for projects.')
			)
		);
		out.push(indented(2, dim('  '), cmd('.help', '.help'), dim(' lists everything.')));

		return { lines: out };
	}
};

/* ------------------------------------------------------------------ */
/* k — experience as a call stack                                     */
/* ------------------------------------------------------------------ */

const stack: Command = {
	name: 'k',
	aliases: ['kb', 'kv', 'kp', 'kn'],
	synopsis: 'Display the call stack — professional experience, most recent frame first.',
	group: 'cv',
	region: 'stack',
	run({ compact }) {
		const out: Line[] = [
			line(dim('Thread: '), s('charlie', 'hi'), dim('   Frames: '), s(String(role.frames.length))),
			blank()
		];

		if (!compact) {
			out.push(
				line(
					s(pad(' #', 3), 'amber'),
					s(pad('Child-SP', 18), 'amber'),
					s(pad('RetAddr', 18), 'amber'),
					s('Call Site', 'amber')
				)
			);
		}

		out.push(line(dim(role.title + ' — '), hi(role.company)));
		out.push(indented(2, s('  '), s(role.period, 'green')));
		out.push(blank());

		for (const f of role.frames) {
			// The address columns are pure texture; on a phone they would push
			// the symbol — the only part that carries meaning — off the line.
			out.push(
				compact
					? line(s(pad(f.n, 3), 'faint'), s(f.symbol, 'cyan'))
					: line(
							s(pad(f.n, 3), 'faint'),
							faint(pad(f.childSp, 18)),
							faint(pad(f.retAddr, 18)),
							s(f.symbol, 'cyan')
						)
			);
			out.push(prose(f.text, 3));
			out.push(blank());
		}

		out.push(
			indented(
				2,
				dim('  Frame 0 is current. '),
				cmd('!process 0 0', '!process 0 0'),
				dim(' shows work outside this stack.')
			)
		);
		return { lines: out };
	}
};

/* ------------------------------------------------------------------ */
/* lm — skills as loaded modules                                      */
/* ------------------------------------------------------------------ */

const modules: Command = {
	name: 'lm',
	aliases: ['lmv', '!skills'],
	synopsis: 'List loaded modules — technical skills, grouped by domain.',
	group: 'cv',
	region: 'modules',
	run({ args, compact }) {
		const filter = args.find((a) => !['v', 'm', 'k', 'l'].includes(a.toLowerCase()));
		const shown = filter
			? skillModules.filter(
					(m) =>
						m.module.toLowerCase().includes(filter.toLowerCase()) ||
						m.label.toLowerCase().includes(filter.toLowerCase())
				)
			: skillModules;

		if (shown.length === 0) {
			return {
				lines: [
					text(`Unable to enumerate modules matching '${filter}'.`, 'red'),
					indented(2, dim('  Try '), cmd('lm', 'lm'), dim(' with no filter.'))
				]
			};
		}

		const out: Line[] = [];

		if (!compact) {
			out.push(
				line(s(pad('start', 18), 'amber'), s(pad('end', 18), 'amber'), s('module name', 'amber'))
			);
			out.push(blank());
		}

		for (const m of shown) {
			out.push(
				compact
					? line(s(pad(m.module, 12), 'cyan'), dim(m.label))
					: line(
							faint(pad(m.base, 18)),
							faint(pad(m.end, 18)),
							s(pad(m.module, 12), 'cyan'),
							green('(loaded)'),
							dim('   ' + m.label)
						)
			);
			out.push(indented(compact ? 2 : 4, s(compact ? '  ' : '    '), ...joinItems(m.items)));
			out.push(blank());
		}

		out.push(indented(2, dim('  Deep dives: '), cmd('!process 0 0', '!process 0 0'), dim(' (projects), '), cmd('k', 'k'), dim(' (where these were used).')));
		return { lines: out };
	}
};

/** Renders a skill list as comma-separated, individually highlighted spans. */
function joinItems(items: string[]) {
	const spans = [];
	for (let i = 0; i < items.length; i++) {
		spans.push(s(items[i], 'default'));
		if (i < items.length - 1) spans.push(dim(', '));
	}
	return spans;
}

/* ------------------------------------------------------------------ */
/* !process — projects                                                */
/* ------------------------------------------------------------------ */

const processCmd: Command = {
	name: '!process',
	aliases: ['!projects', '!proc'],
	synopsis: 'Dump active processes — open source contributions and personal projects.',
	group: 'cv',
	region: 'platter',
	run({ args, compact }) {
		// `!process 0 0` (or bare) lists everything; anything else selects one.
		const selector = args
			.filter((a) => a !== '0')
			.join(' ')
			.trim();

		if (selector) {
			const p = projects.find(
				(x) =>
					x.id === selector.toLowerCase() ||
					x.image.toLowerCase() === selector.toLowerCase() ||
					x.name.toLowerCase().includes(selector.toLowerCase())
			);
			if (!p) {
				return {
					lines: [
						text(`Cannot find process '${selector}'.`, 'red'),
						indented(2, dim('  Run '), cmd('!process 0 0', '!process 0 0'), dim(' to list them.'))
					]
				};
			}

			const out: Line[] = compact
				? [
						line(s(p.image, 'cyan')),
						indented(
							2,
							s('  '),
							s(
								p.kind === 'open-source' ? 'open source contribution' : 'personal project',
								p.kind === 'open-source' ? 'green' : 'magenta'
							)
						),
						blank(),
						prose(p.blurb, 2),
						blank()
					]
				: [
						line(s('PROCESS ', 'amber'), s(p.address, 'hi')),
						indented(
							4,
							s('    '),
							dim('Image: '),
							s(p.image, 'cyan'),
							dim('   Cid: '),
							faint(p.cid)
						),
						indented(
							4,
							s('    '),
							dim('Type:  '),
							s(
								p.kind === 'open-source' ? 'open source contribution' : 'personal project',
								p.kind === 'open-source' ? 'green' : 'magenta'
							)
						),
						blank(),
						prose(p.blurb, 4),
						blank()
					];

			for (const d of p.details) out.push(prose('· ' + d, 6));
			if (p.pending) {
				out.push(blank());
				out.push(indented(6, s('      '), amber('[PENDING] '), s(p.pending.replace(/^Pending merge:\s*/i, ''))));
			}

			out.push(blank());
			out.push(indented(4, s('    '), dim('Stack: '), ...joinItems(p.stack)));

			if (p.links.length) {
				out.push(blank());
				for (const l of p.links) {
					out.push(indented(4, s('    '), dim('→ '), link(l.label, l.href)));
				}
			}

			out.push(blank());
			out.push(indented(2, dim('  Back to the list: '), cmd('!process 0 0', '!process 0 0')));
			return { lines: out };
		}

		const width = ruleWidth(compact);
		const out: Line[] = [text('**** NT ACTIVE PROCESS DUMP ****', 'amber'), blank()];

		for (const group of ['open-source', 'personal'] as const) {
			const inGroup = projects.filter((p) => p.kind === group);
			out.push(...rule(group === 'open-source' ? 'open source' : 'personal', width));
			out.push(blank());
			for (const p of inGroup) {
				if (!compact) out.push(line(s('PROCESS ', 'faint'), s(p.address, 'faint')));
				out.push(
					compact
						? line(dim('Image: '), cmd(p.image, `!process ${p.id}`))
						: indented(
								4,
								s('    '),
								dim('Image: '),
								cmd(p.image, `!process ${p.id}`),
								dim('   Cid: '),
								faint(p.cid)
							)
				);
				out.push(prose(p.blurb, compact ? 2 : 4));
				out.push(blank());
			}
		}

		out.push(
			indented(2, dim('  Click any image name, or run '), cmd('!process veracrypt', '!process veracrypt'), dim(', for detail.'))
		);
		return { lines: out };
	}
};

/* ------------------------------------------------------------------ */
/* dt — qualifications as a struct dump                               */
/* ------------------------------------------------------------------ */

const dt: Command = {
	name: 'dt',
	aliases: ['!quals', '!education'],
	synopsis: 'Dump a type — formal qualifications.',
	group: 'cv',
	region: 'heap',
	run({ compact }) {
		const out: Line[] = [line(s('charlie!', 'dim'), s('_QUALIFICATIONS', 'magenta'))];
		for (const q of qualifications) {
			out.push(
				compact
					? line(faint('+' + q.offset + ' '), s(q.field, 'cyan'))
					: line(
							faint('   +' + q.offset + ' '),
							s(pad(q.field, 24), 'cyan'),
							dim(': '),
							s(q.type, 'magenta'),
							dim('  '),
							s(`"${q.value}"`, 'green')
						)
			);
			if (compact) out.push(indented(2, s('  '), s(q.type, 'magenta'), dim('  '), s(`"${q.value}"`, 'green')));
		}
		out.push(blank());
		out.push(
			prose(
				'Sizeof(_QUALIFICATIONS) = 0x60 bytes. Everything after this was self-taught.',
				2
			)
		);
		out.push(indented(2, dim('  See '), cmd('!analyze -v', '!analyze -v'), dim('.')));
		return { lines: out };
	}
};

/* ------------------------------------------------------------------ */
/* !contact                                                            */
/* ------------------------------------------------------------------ */

const contact: Command = {
	name: '!contact',
	aliases: ['.contact', 'contact', '!symbols'],
	synopsis: 'Resolve symbols — how to get in touch.',
	group: 'cv',
	region: 'contact',
	run({ compact }) {
		return {
			lines: [
				text('Symbol search path is: ' + meta.symbolPath, 'dim'),
				blank(),
				...kv('NAME', [hi(identity.name)], compact, 12),
				...kv('ROLE', [s(identity.title)], compact, 12),
				...kv('LOCATION', [s(identity.nationality)], compact, 12),
				...kv('EMAIL', [link(identity.email, 'mailto:' + identity.email)], compact, 12),
				...kv('GITHUB', [link(identity.github, identity.githubUrl)], compact, 12),
				blank(),
				indented(2, dim('  '), cmd('.dump', '.dump'), dim(' writes a printable copy of this CV.'))
			]
		};
	}
};

/* ------------------------------------------------------------------ */
/* Session commands                                                    */
/* ------------------------------------------------------------------ */

const help: Command = {
	name: '.help',
	aliases: ['?', 'help', '.hh'],
	synopsis: 'List available commands.',
	group: 'session',
	run({ compact }) {
		const out: Line[] = [text('Command overview', 'amber'), blank(), text('CV', 'green')];
		const push = (c: Command) =>
			out.push(
				compact
					? indented(2, s('  '), cmd(c.name, c.name), dim('  ' + c.synopsis))
					: indented(4, s('  '), cmd(pad(c.name, 16), c.name), dim(c.synopsis))
			);

		for (const c of registry.filter((c) => c.group === 'cv' && !c.hidden)) push(c);
		out.push(blank(), text('Session', 'green'));
		for (const c of registry.filter((c) => c.group === 'session' && !c.hidden)) push(c);
		out.push(blank(), text('Other', 'green'));
		for (const c of registry.filter((c) => c.group === 'fun' && !c.hidden)) push(c);
		out.push(
			blank(),
			indented(
				2,
				dim('  ↑/↓ history · Tab completes · Ctrl+L clears · every '),
				cyan('cyan'),
				dim(' word is clickable.')
			)
		);
		return { lines: out };
	}
};

const cls: Command = {
	name: '.cls',
	aliases: ['cls', 'clear'],
	synopsis: 'Clear the command window.',
	group: 'session',
	run() {
		return { lines: [], clear: true };
	}
};

const go: Command = {
	name: 'g',
	aliases: ['go'],
	synopsis: 'Go — resume the target and return to the overview.',
	group: 'session',
	region: 'home',
	run() {
		return {
			lines: [
				text('Target resumed.', 'green'),
				indented(2, dim('  '), cmd('!analyze -v', '!analyze -v'), dim(' to break in again.'))
			]
		};
	}
};

const version: Command = {
	name: 'version',
	aliases: ['vertarget', '.ver'],
	synopsis: 'Show debugger and target version information.',
	group: 'session',
	run() {
		return {
			lines: [
				text('Windows Debugger Version ' + meta.debuggerVersion, 'dim'),
				text(meta.osBuild, 'dim'),
				blank(),
				field('TARGET', [s(meta.target, 'hi')], 16),
				field('RENDERER', [s('Svelte 5 · Threlte 8 · three.js · WebGL2')], 16),
				field('BUILD', [s('static, prerendered')], 16),
				blank(),
				indented(2, dim('  Source and everything else: '), link(identity.github, identity.githubUrl))
			]
		};
	}
};

const reload: Command = {
	name: '.reload',
	aliases: ['.restart'],
	synopsis: 'Reload symbols — replay the boot sequence.',
	group: 'session',
	run() {
		return { lines: [text('Reloading symbols...', 'dim')], reboot: true, clear: true };
	}
};

const dump: Command = {
	name: '.dump',
	aliases: ['.writemem', 'print'],
	synopsis: 'Write a printable / PDF copy of the CV.',
	group: 'session',
	run() {
		return {
			lines: [
				text('Writing full dump...', 'dim'),
				line(green('Dump successfully written. '), dim('Use your print dialog to save as PDF.'))
			],
			print: true
		};
	}
};

/* ------------------------------------------------------------------ */
/* Easter eggs                                                         */
/* ------------------------------------------------------------------ */

const teb: Command = {
	name: '!teb',
	aliases: ['!peb', '!site'],
	synopsis: 'Thread environment block — how this site was built.',
	group: 'fun',
	run() {
		return {
			lines: [
				text('TEB at 000000cc`0e4f1000', 'dim'),
				blank(),
				prose(
					'This page is a SvelteKit application rendered to static HTML, with a three.js scene driven by Threlte behind the debugger chrome. The 3D view is a stylised kernel address space: the command you run moves the camera to the region that holds that data.',
					2
				),
				blank(),
				prose(
					'Everything you can read here also exists as plain semantic HTML for screen readers and crawlers — the terminal is the interface, not the content.',
					2
				),
				blank(),
				indented(2, dim('  No analytics. No cookies. No network calls after load.'))
			]
		};
	}
};

const disasm: Command = {
	name: 'u',
	aliases: ['uf'],
	synopsis: 'Unassemble.',
	group: 'fun',
	hidden: true,
	run() {
		return {
			lines: [
				text('charlie!main:', 'cyan'),
				line(faint('fffff801`4a001000 '), dim('4883ec28        '), s('sub', 'magenta'), s('     rsp,28h')),
				line(faint('fffff801`4a001004 '), dim('488d0d2e1f0000  '), s('lea', 'magenta'), s('     rcx,[charlie!HardProblems]')),
				line(faint('fffff801`4a00100b '), dim('e820000000      '), s('call', 'magenta'), s('    charlie!TakeOwnership')),
				line(faint('fffff801`4a001010 '), dim('85c0            '), s('test', 'magenta'), s('    eax,eax')),
				line(faint('fffff801`4a001012 '), dim('75ec            '), s('jne', 'magenta'), s('     charlie!main+0x0')),
				line(faint('fffff801`4a001014 '), dim('c3              '), s('ret', 'magenta')),
				blank(),
				indented(2, dim('  The loop is intentional.'))
			]
		};
	}
};

const bugcheck: Command = {
	name: '!bugcheck',
	aliases: ['.crash', '.bugcheck'],
	synopsis: 'Bugcheck the target. (You probably should not.)',
	group: 'fun',
	run() {
		return { lines: [text('Bugchecking target...', 'red')], bugcheck: true };
	}
};

const detach: Command = {
	name: 'q',
	aliases: ['qd', '.detach', 'exit'],
	synopsis: 'Quit the debugging session.',
	group: 'fun',
	hidden: true,
	run() {
		return {
			lines: [
				text('Cannot detach: the target is still live.', 'red'),
				indented(2, dim('  Try '), cmd('!contact', '!contact'), dim(' instead.'))
			]
		};
	}
};

/* ------------------------------------------------------------------ */
/* Registry and dispatch                                               */
/* ------------------------------------------------------------------ */

export const registry: Command[] = [
	analyze,
	stack,
	modules,
	processCmd,
	dt,
	contact,
	help,
	cls,
	go,
	version,
	reload,
	dump,
	teb,
	disasm,
	bugcheck,
	detach
];

/** Every name and alias, for tab completion. */
export const completions: string[] = registry
	.filter((c) => !c.hidden)
	.flatMap((c) => [c.name, ...(c.aliases ?? [])])
	.filter((n) => !n.includes(' '))
	.sort();

function findCommand(name: string): Command | undefined {
	const lower = name.toLowerCase();
	return registry.find(
		(c) => c.name.toLowerCase() === lower || (c.aliases ?? []).some((a) => a.toLowerCase() === lower)
	);
}

export function dispatch(raw: string, compact = false): CommandResult {
	const trimmed = raw.trim();
	if (!trimmed) return { lines: [] };

	const tokens = trimmed.split(/\s+/);
	let command = findCommand(tokens[0]);
	let args = tokens.slice(1);

	// Allow two-token command names such as `lm v` to resolve naturally by
	// falling back to the first token, which is already the behaviour above.
	if (!command && tokens.length > 1) {
		command = findCommand(tokens[0] + ' ' + tokens[1]);
		if (command) args = tokens.slice(2);
	}

	if (!command) {
		return {
			lines: [
				line(red(`Couldn't resolve error at '`), s(tokens[0], 'hi'), red(`'`)),
				indented(2, dim('  Run '), cmd('.help', '.help'), dim(' for the command list.'))
			]
		};
	}

	const result = command.run({ args, raw: trimmed, compact });
	return { region: command.region, ...result };
}
