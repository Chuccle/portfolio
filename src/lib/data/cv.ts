/**
 * The CV, as data. Every terminal command and every region of the 3D scene
 * renders from this file — there is no second copy of the content anywhere.
 */

export interface Identity {
	name: string;
	handle: string;
	nationality: string;
	email: string;
	github: string;
	githubUrl: string;
	title: string;
	statement: string;
}

export const identity: Identity = {
	name: 'Charlie Cohen',
	handle: 'charlie',
	nationality: 'British National',
	// Assembled at runtime so the raw address never sits in the served HTML.
	email: ['charlie11cohen', 'gmail.com'].join('@'),
	github: 'github.com/Chuccle',
	githubUrl: 'https://github.com/Chuccle',
	title: 'Software Engineer — Windows kernel, drivers & EFI',
	statement:
		'Generalist software engineer with a deep specialism in low-level Windows driver and EFI development. At ESET Research UK I have delivered EFI pre-boot authentication, partition-aware disk layout support across the entire product, and a used space encryption feature that cut full disk encryption time by up to 99%. I work comfortably across the whole spectrum, from legacy C89 and pre-modern C++ codebases through C17 and C++20, and from kernel drivers, boot code, COM, MFC, and Windows services up to modern application and web stacks. I am driven by finding elegant solutions to hard problems at the intersection of security and systems programming, and by taking ownership of problems beyond my formal remit.'
};

/* ------------------------------------------------------------------ */
/* Key achievements — rendered by `!analyze -v`                        */
/* ------------------------------------------------------------------ */

export interface Achievement {
	id: string;
	/** Flavour bugcheck code — the problem, stated as a fault. */
	code: string;
	title: string;
	body: string;
	/** The resolution line, rendered as "Probably caused by". */
	impact: string;
}

export const achievements: Achievement[] = [
	{
		id: 'hibernate',
		code: 'HIBERNATE_RESUME_UNCRACKED',
		title: 'Self-taught reverse engineering to deliver fast hibernate/resume',
		body: 'Learned reverse engineering methodology within days to characterise undocumented OS behaviour around crash dump handling, then used those findings to implement hibernate read filtering and resolve a kernel access violation on resume that a colleague had previously been unable to crack.',
		impact: 'Undocumented OS behaviour characterised from scratch; a blocking defect cleared.'
	},
	{
		id: 'partition',
		code: 'DISK_LAYOUT_NOT_DYNAMIC',
		title: 'Proposed and solely delivered partition-aware disk layout support',
		body: 'Secured buy-in for dynamic add/resize/delete of encrypted partitions; when the existing architecture made a contained fix untenable, mapped the cascading impact and footprint of every required change, proposed modifications to other component owners as working draft commits, and briefed stakeholders and testers so changes could be exercised early; implemented the full cross-product rearchitecture single-handedly, fixing latent technical debt failure points along the way. The initial release landed so well that the remit was expanded to automatically detecting and encrypting newly created partitions, delivered on the original deadline.',
		impact:
			'Cross-product rearchitecture shipped solo, on the original deadline, with scope expanded mid-flight.'
	},
	{
		id: 'usedspace',
		code: 'FULL_DISK_ENCRYPTION_TOO_SLOW',
		title: 'Designed a state-of-the-art encryption feature from first principles',
		body: 'Conceived, designed, and delivered a used space encryption feature that achieves up to 99% faster full disk encryption while remaining fully compatible with the existing on-disk format, a non-trivial constraint that required genuinely novel design rather than a known pattern.',
		impact: 'Up to 99% faster full disk encryption, with zero on-disk format breakage.'
	},
	{
		id: 'oss',
		code: 'IRQL_NOT_LESS_OR_EQUAL',
		title: 'Recognised externally through open source security contributions',
		body: 'Patched DDI IRQL and HVCI violations in the VeraCrypt crash dump filter, a fix requiring correct MDL manipulation under HIGH_LEVEL IRQL, a constraint with virtually no public documentation.',
		impact: 'Upstream fixes merged into a widely deployed encryption product.'
	}
];

/* ------------------------------------------------------------------ */
/* Skills — rendered by `lm` as a loaded module list                   */
/* ------------------------------------------------------------------ */

export interface SkillModule {
	module: string;
	label: string;
	base: string;
	end: string;
	items: string[];
}

export const skillModules: SkillModule[] = [
	{
		module: 'lang',
		label: 'Languages',
		base: 'fffff801`4a000000',
		end: 'fffff801`4a3e1000',
		items: [
			'C (C89–C17)',
			'C++ (C++98–C++20)',
			'C#',
			'Rust',
			'Kotlin',
			'SQL',
			'TypeScript',
			'JavaScript',
			'PHP',
			'HTML',
			'CSS'
		]
	},
	{
		module: 'kerneldrv',
		label: 'Kernel & Driver',
		base: 'fffff801`4b000000',
		end: 'fffff801`4b2c4000',
		items: [
			'WDM',
			'WDK',
			'KMDF',
			'UMDF (IDD)',
			'encryption minifilters',
			'FDE disk filters',
			'legacy FSD (personal)',
			'NT internals'
		]
	},
	{
		module: 'secboot',
		label: 'Security & Boot',
		base: 'fffff801`4c000000',
		end: 'fffff801`4c5a8000',
		items: [
			'EDK II',
			'EFI/UEFI',
			'EFI pre-boot authentication',
			'MBR bootloaders',
			'OPAL',
			'TPM',
			'HVCI',
			'DSE',
			'KPP (PatchGuard)',
			'IOCTL hardening',
			'AES-NI',
			'BitLocker internals',
			'reverse engineering (undocumented APIs & binary)',
			'penetration testing'
		]
	},
	{
		module: 'frameworks',
		label: 'Frameworks & Tech',
		base: 'fffff801`4d000000',
		end: 'fffff801`4d1f9000',
		items: [
			'WIN32',
			'COM',
			'MFC',
			'Windows services',
			'Actix',
			'Axum',
			'FlatBuffers',
			'Protocol Buffers',
			'React',
			'Express',
			'Node.js',
			'WiX'
		]
	},
	{
		module: 'toolchain',
		label: 'Tools & Platforms',
		base: 'fffff801`4e000000',
		end: 'fffff801`4e0d3000',
		items: [
			'WinDbg (live kernel & dump)',
			'Visual Studio',
			'Git',
			'Jenkins',
			'JIRA',
			'CMake',
			'NMAKE',
			'Linux'
		]
	}
];

/* ------------------------------------------------------------------ */
/* Experience — rendered by `k` as a call stack                        */
/* ------------------------------------------------------------------ */

export interface StackFrame {
	n: string;
	symbol: string;
	childSp: string;
	retAddr: string;
	text: string;
}

export interface Role {
	company: string;
	title: string;
	period: string;
	frames: StackFrame[];
}

export const roles: Role[] = [
	{
		company: 'ESET Research UK',
		title: 'Software Engineer',
		period: 'August 2022 – Present',
		frames: [
			{
				n: '00',
				symbol: 'eset!HibernateReadFiltering',
				childSp: 'ffffd80f`3a1c7a20',
				retAddr: 'fffff801`4b0221e0',
				text: 'Implemented hibernate read filtering informed by reverse engineering of undocumented crash dump behaviour, resolving a kernel access violation on resume and matching industry performance.'
			},
			{
				n: '01',
				symbol: 'eset!PartitionAwareDiskLayout',
				childSp: 'ffffd80f`3a1c7ac0',
				retAddr: 'fffff801`4b04f3c4',
				text: 'Delivered partition-aware disk layout support: dynamic add/resize/delete of encrypted partitions, automatic detection of new partitions, and repair logic for broken legacy layouts.'
			},
			{
				n: '02',
				symbol: 'eset!UsedSpaceEncryption',
				childSp: 'ffffd80f`3a1c7b80',
				retAddr: 'fffff801`4c01a9f0',
				text: 'Proposed, architected, and delivered the used space encryption feature end to end using AES-NI, discovering and patching critical off-by-one errors and weak parameter validation during development.'
			},
			{
				n: '03',
				symbol: 'eset!ExFatVolumeRedesign',
				childSp: 'ffffd80f`3a1c7c10',
				retAddr: 'fffff801`4b118c08',
				text: 'Resolved virtual disk corruption above 500 GB by redesigning ExFAT formatting logic from the Microsoft specification, extending volume support to 16 TB and replacing outdated FAT32 logic.'
			},
			{
				n: '04',
				symbol: 'eset!EfiMbrBootloaderFixes',
				childSp: 'ffffd80f`3a1c7cd0',
				retAddr: 'fffff801`4c0773a8',
				text: 'Resolved bugs and correctness issues in existing EFI/EDK II and MBR bootloader implementations, working at the pre-boot boundary where conventional OS-level debugging and runtime facilities are unavailable.'
			},
			{
				n: '05',
				symbol: 'eset!SecurityResponseLead',
				childSp: 'ffffd80f`3a1c7d60',
				retAddr: 'fffff801`4c09b114',
				text: 'Acted as technical lead for resolving externally reported security issues, coordinating investigation, remediation, and validation across affected components. Proactively penetration-tested and security-reviewed my own and team-owned code, crafting adversarial IOCTL payloads and API calls to identify input-validation flaws, race conditions, denial-of-service conditions, and other vulnerabilities before release.'
			},
			{
				n: '06',
				symbol: 'eset!RemoteDesktopReview',
				childSp: 'ffffd80f`3a1c7e00',
				retAddr: 'fffff801`4d02c760',
				text: 'Contribute code review and design input to ESET Remote Desktop on an ongoing basis, including pair programming with principal developers; proposed replacing a flawed mutex and TOCTOU-prone atomics with strand-based serialisation of critical section code.'
			},
			{
				n: '07',
				symbol: 'eset!DenialOfServiceMitigation',
				childSp: 'ffffd80f`3a1c7ea0',
				retAddr: 'fffff801`4b1d0428',
				text: 'Identified and mitigated denial-of-service vulnerabilities involving kernel APCs, KEVENT, and ERESOURCE objects; hardened IOCTL and API validation, and eliminated race conditions.'
			},
			{
				n: '08',
				symbol: 'eset!HvciDseCompliance',
				childSp: 'ffffd80f`3a1c7f40',
				retAddr: 'fffff801`4b23ae90',
				text: 'Modernised encryption minifilters, FDE disk filter drivers, and UMDF indirect display drivers for HVCI and DSE compliance, enforcing correct MDL handling and DDI IRQL discipline throughout.'
			},
			{
				n: '09',
				symbol: 'eset!VssToGitMigration',
				childSp: 'ffffd80f`3a1c8010',
				retAddr: 'fffff801`4e00b2d0',
				text: 'Led migration of the ESET endpoint encryption product from Visual Source Safe to Bitbucket Git, refactoring over one million lines of code across 70 components by breaking cyclic dependencies, removing duplicate libraries, modernising for stricter compiler standards, and enabling full CI/CD integration.'
			},
			{
				n: '0a',
				symbol: 'eset!BuildSystemModernisation',
				childSp: 'ffffd80f`3a1c80b0',
				retAddr: 'fffff801`4e01c644',
				text: 'Migrated legacy NT drivers from NMAKE to Visual Studio build tools and built Jenkins pipelines for automated testing and release across multiple products.'
			},
			{
				n: '0b',
				symbol: 'eset!ProtobufAndInstallers',
				childSp: 'ffffd80f`3a1c8150',
				retAddr: 'fffff801`4d0e1078',
				text: 'Upgraded API implementations to use Protocol Buffers, reducing bandwidth usage; developed automatically localised WiX installers for complex products.'
			}
		]
	}
];

/* ------------------------------------------------------------------ */
/* Projects — rendered by `!process 0 0`                               */
/* ------------------------------------------------------------------ */

export interface ProjectLink {
	label: string;
	href: string;
}

export interface Project {
	id: string;
	name: string;
	image: string;
	kind: 'open-source' | 'personal';
	address: string;
	cid: string;
	blurb: string;
	details: string[];
	pending?: string;
	links: ProjectLink[];
	stack: string[];
}

export const projects: Project[] = [
	{
		id: 'veracrypt',
		name: 'VeraCrypt',
		image: 'veracrypt.sys',
		kind: 'open-source',
		address: 'ffffa50c`1b2c3080',
		cid: '0f24',
		blurb:
			'Crash dump filter driver fixes in a widely deployed open source disk encryption product.',
		details: [
			'Identified and corrected DDI IRQL violations and HVCI violations in the crash dump filter driver.',
			'Implemented correct MDL manipulation under the highly constrained HIGH_LEVEL IRQL, a requirement with virtually no public documentation.'
		],
		pending:
			'Pending merge: fix for Windows aggressively suspending USB devices below D0 power state, causing failed dismounts and general I/O errors.',
		links: [
			{ label: 'commit c1ae011b', href: 'https://github.com/veracrypt/VeraCrypt/commit/c1ae011b' }
		],
		stack: ['C', 'WDM', 'MDL', 'HVCI', 'IRQL']
	},
	{
		id: 'ente',
		name: 'ente (E2EE Cloud)',
		image: 'ente.museum',
		kind: 'open-source',
		address: 'ffffa50c`1b3d1400',
		cid: '1a08',
		blurb: 'Server-side fixes for a self-hosted, end-to-end encrypted photo platform.',
		details: ['Fixed a bug affecting automatic admin whitelisting in self-hosted deployments.'],
		pending:
			'Pending merge: fix for compliance hold behaviour and configurable S3 object garbage collection.',
		links: [{ label: 'commit c24aea2f', href: 'https://github.com/ente-io/ente/commit/c24aea2f' }],
		stack: ['Go', 'S3', 'self-hosting']
	},
	{
		id: 'anticheat',
		name: 'Windows Anticheat Driver',
		image: 'anticheat.sys',
		kind: 'personal',
		address: 'ffffa50c`1c0a2200',
		cid: '2b7c',
		blurb: 'Kernel-mode anticheat driver written in modern C++.',
		details: [
			'Uses ObRegisterCallbacks for handle interception and PsSetCreateProcessNotifyRoutine for process lifecycle monitoring.',
			'Memory scanning to detect suspicious allocations and mappings.'
		],
		links: [],
		stack: ['C++20', 'KMDF', 'ObCallbacks', 'NT internals']
	},
	{
		id: 'blorgfs',
		name: 'BlorgFS',
		image: 'blorgfs.sys',
		kind: 'personal',
		address: 'ffffa50c`1c4f8900',
		cid: '3d10',
		blurb: 'A legacy Windows file system driver written from scratch, backed by a Rust server.',
		details: [
			'Implements a legacy Windows file system driver (FSD) from scratch.',
			'Communicates with a Rust Axum file server using FlatBuffers for efficient serialisation and caching.',
			'Enables transparent NAS access via Windows Explorer.'
		],
		links: [],
		stack: ['C', 'FSD', 'Rust', 'Axum', 'FlatBuffers']
	},
	{
		id: 'alarm',
		name: 'Alarm System',
		image: 'alarmsys.elf',
		kind: 'personal',
		address: 'ffffa50c`1c9b1180',
		cid: '4e44',
		blurb: 'Physical security system with a web control plane.',
		details: [
			'Security system using a BBC micro:bit, PIR sensor, and Raspberry Pi.',
			'Connected to a Rust Actix web server for remote event tracking and control.'
		],
		links: [],
		stack: ['Rust', 'Actix', 'micro:bit', 'Raspberry Pi']
	},
	{
		id: 'homelab',
		name: 'Home Infrastructure',
		image: 'proxmox.vmm',
		kind: 'personal',
		address: 'ffffa50c`1d220f00',
		cid: '5f2a',
		blurb: 'Self-hosted, network-segmented home lab.',
		details: [
			'Proxmox server hosting an OPNsense virtual router with DNSSEC and Unbound.',
			'Jellyfin media server in an unprivileged LXC container with cgroup GPU passthrough.',
			'A self-hosted ente container configured via NixOS.',
			'Remote access gated behind a WireGuard VPN.'
		],
		links: [],
		stack: ['Proxmox', 'OPNsense', 'NixOS', 'LXC', 'WireGuard']
	}
];

/* ------------------------------------------------------------------ */
/* Qualifications — rendered by `dt _QUALIFICATIONS`                   */
/* ------------------------------------------------------------------ */

export interface Qualification {
	offset: string;
	field: string;
	type: string;
	value: string;
}

export const qualifications: Qualification[] = [
	{ offset: '0x000', field: 'BtecExtendedDiploma', type: 'BusinessIT_L3', value: 'D*D*D*' },
	{ offset: '0x018', field: 'CambridgeNationalsICT', type: 'Grade', value: 'Distinction*' },
	{ offset: '0x030', field: 'ECDL', type: 'Grade', value: 'Distinction*' },
	{
		offset: '0x048',
		field: 'GCSEs',
		type: 'Array[8]',
		value: 'grades 4–9, including English and Maths'
	}
];

/* ------------------------------------------------------------------ */
/* Site / session metadata                                             */
/* ------------------------------------------------------------------ */

export const meta = {
	debuggerVersion: '10.0.27725.1000 AMD64',
	target: 'CHARLIE-COHEN',
	osBuild: 'Windows 11 Kernel Version 26100 MP (16 procs) Free x64',
	symbolPath: 'srv*https://github.com/Chuccle',
	description:
		'Charlie Cohen — software engineer specialising in Windows kernel drivers, EFI/UEFI pre-boot, and full disk encryption. Interactive portfolio and CV.'
} as const;
