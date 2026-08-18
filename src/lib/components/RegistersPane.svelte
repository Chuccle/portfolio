<script lang="ts">
	import { projects, roles, skillModules } from '$lib/data/cv';

	const hex = (value: number, width = 16) =>
		value.toString(16).padStart(width, '0').replace(/(.{8})(.{8})/, '$1`$2');

	const yearsAtEset = Math.floor(
		(Date.now() - new Date('2022-08-01').getTime()) / (365.25 * 24 * 3600 * 1000)
	);

	const skillCount = skillModules.reduce((total, m) => total + m.items.length, 0);

	/**
	 * Register values are real numbers from the CV, which makes the pane a
	 * genuine summary rather than decoration.
	 */
	const registers = [
		{ name: 'rax', value: hex(yearsAtEset), note: `years at ${roles[0].company}` },
		{ name: 'rbx', value: hex(1_000_000), note: 'lines migrated to Git' },
		{ name: 'rcx', value: hex(99), note: '% faster full disk encryption' },
		{ name: 'rdx', value: hex(70), note: 'components refactored' },
		{ name: 'rsi', value: hex(16), note: 'TB max volume after ExFAT redesign' },
		{ name: 'rdi', value: hex(skillCount), note: 'tracked skills' },
		{ name: 'r8 ', value: hex(projects.length), note: 'projects in the dump' },
		{ name: 'r9 ', value: hex(roles[0].frames.length), note: 'stack frames' }
	];
</script>

<section class="pane bevel-in" aria-label="Register summary">
	<header class="pane-title">Registers</header>
	<ul>
		{#each registers as register (register.name)}
			<li>
				<span class="name">{register.name}</span><span class="eq">=</span><span class="value"
					>{register.value}</span
				>
				<span class="note">; {register.note}</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.pane {
		background: var(--bg-panel);
		min-height: 0;
		/* Flex/grid items default to min-width: auto, which lets a long
		   unbreakable register note force this pane (and the whole fixed-width
		   dock column) wider than intended instead of being clipped. */
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.pane-title {
		padding: 0.3rem 0.65rem;
		font-family: var(--ui);
		font-size: 0.8rem;
		color: var(--phosphor-dim);
		background: var(--bg-chrome);
		border-bottom: 1px solid var(--bevel-lo);
		user-select: none;
	}

	ul {
		padding: 0.5rem 0.7rem;
		overflow-y: auto;
		overflow-x: hidden;
		min-width: 0;
		font-size: 0.92em;
	}

	li {
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name {
		color: var(--alt);
	}

	.eq {
		color: var(--phosphor-faint);
	}

	.value {
		color: var(--phosphor);
		font-variant-numeric: tabular-nums;
	}

	.note {
		color: var(--phosphor-faint);
	}

	/* Not enough room to be useful on a phone. */
	@media (max-width: 720px) {
		.pane {
			display: none;
		}
	}
</style>
