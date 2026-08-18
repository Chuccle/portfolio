/** Semantic colour roles, mapped to CSS custom properties by the renderer. */
export type Tone = 'default' | 'dim' | 'faint' | 'hi' | 'cyan' | 'blue' | 'green' | 'amber' | 'red' | 'magenta';

/**
 * A run of text inside a line. A span can additionally be a hyperlink
 * (`href`) or an in-page action that runs another command (`cmd`), which is
 * what makes the transcript navigable without typing.
 */
export interface Span {
	text: string;
	tone?: Tone;
	href?: string;
	cmd?: string;
	bold?: boolean;
}

export interface Line {
	spans: Span[];
	/** Hanging indent in `ch` units, preserved when the line soft-wraps. */
	indent?: number;
	/** Renders in a subdued "quoted body text" style rather than as code. */
	prose?: boolean;
}

/**
 * Regions of the 3D address space. Each command declares the region the
 * camera should fly to, which is how the terminal and the scene stay in sync.
 */
export type Region = 'home' | 'stack' | 'modules' | 'platter' | 'heap' | 'contact';

export interface CommandContext {
	/** Raw argument list, already split on whitespace. */
	args: string[];
	/** The full raw input, useful for commands with loose syntax. */
	raw: string;
	/**
	 * True on narrow viewports. Wide address columns are dropped rather than
	 * left to wrap into noise — a phone gets a different listing, not a
	 * horizontally scrolling one.
	 */
	compact: boolean;
}

export interface CommandResult {
	lines: Line[];
	region?: Region;
	/** Side effects the session applies after rendering. */
	clear?: boolean;
	bugcheck?: boolean;
	reboot?: boolean;
	print?: boolean;
}

export interface Command {
	name: string;
	aliases?: string[];
	/** One-line summary shown by `.help`. */
	synopsis: string;
	/** Grouping in the help output. */
	group?: 'cv' | 'session' | 'fun';
	/** Hidden from `.help`, still runnable. */
	hidden?: boolean;
	region?: Region;
	run(ctx: CommandContext): CommandResult;
}
