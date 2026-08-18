import { meta } from '$lib/data/cv';
import { blank, cyan, dim, faint, green, hi, line, s, text } from './format';
import type { Line } from './types';

export interface BootStep {
	line: Line;
	/** Milliseconds to wait before showing the next step. */
	delay: number;
}

const ok = (label: string, dots = 46): BootStep => ({
	line: line(dim('  ' + label + ' '), faint('.'.repeat(Math.max(3, dots - label.length))), green(' ok')),
	delay: 90
});

/**
 * The pre-boot → debugger-attach sequence. It is deliberately short: the
 * whole thing runs in well under three seconds and is skippable.
 */
export const bootSequence: BootStep[] = [
	{ line: text('ESET SecureBoot Shim v2.1.4 — initialising UEFI services', 'amber'), delay: 260 },
	ok('Loading \\EFI\\Boot\\bootx64.efi'),
	ok('TPM 2.0 PCR[7] measurement'),
	ok('Pre-boot authentication'),
	ok('Unsealing volume master key'),
	ok('Handing off to winload.efi'),
	{ line: blank(), delay: 200 },
	{
		line: text('Microsoft (R) Windows Debugger Version ' + meta.debuggerVersion, 'dim'),
		delay: 60
	},
	{ line: text('Copyright (c) Microsoft Corporation. All rights reserved.', 'faint'), delay: 220 },
	{ line: blank(), delay: 60 },
	{ line: line(dim('Connecting to target '), hi(meta.target), dim(' ...')), delay: 320 },
	{ line: text('Connected to ' + meta.osBuild, 'default'), delay: 80 },
	{ line: line(dim('Symbol search path is: '), cyan(meta.symbolPath)), delay: 80 },
	{ line: blank(), delay: 120 },
	{ line: text('*** Loading portfolio symbols ......... done', 'green'), delay: 260 },
	{ line: blank(), delay: 60 },
	{
		line: text('Break instruction exception - code 80000003 (first chance)', 'amber'),
		delay: 180
	},
	{ line: blank(), delay: 60 },
	{
		line: line(dim('Running '), s('!analyze -v', 'cyan'), dim(' automatically...')),
		delay: 420
	}
];

export const bootDuration = bootSequence.reduce((total, step) => total + step.delay, 0);
