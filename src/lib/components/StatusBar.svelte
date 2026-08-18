<script lang="ts">
	import { session } from '$lib/state/session.svelte';

	const regionLabel: Record<string, string> = {
		home: 'nt!KiSystemStartup',
		stack: 'eset!CallStack',
		modules: 'nt!PsLoadedModuleList',
		platter: 'eset!UsedSpaceEncryption',
		heap: 'nt!ExHeap',
		contact: 'dbghelp!SymSrv'
	};
</script>

<footer class="statusbar">
	<span class="cell wide">{regionLabel[session.region] ?? 'nt!KiSystemStartup'}</span>
	<span class="cell">Proc 000:0</span>
	<span class="cell">Thrd 000:0</span>
	<span class="spacer"></span>
	<span class="cell flag">ASM</span>
	<span class="cell flag">OVR</span>
	<span class="cell flag">NUM</span>
</footer>

<style>
	.statusbar {
		display: flex;
		align-items: center;
		gap: 0;
		padding: 0.2rem 0.4rem;
		padding-bottom: max(0.2rem, env(safe-area-inset-bottom));
		background: var(--bg-chrome);
		border-top: 1px solid var(--bevel-hi);
		font-family: var(--ui);
		font-size: 0.74rem;
		color: var(--phosphor-dim);
		user-select: none;
	}

	.cell {
		padding: 0 0.65rem;
		border-right: 1px solid var(--border);
		white-space: nowrap;
	}

	.cell:last-child {
		border-right: none;
	}

	.wide {
		font-family: var(--mono);
		color: var(--accent);
		min-width: 18ch;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spacer {
		flex: 1;
	}

	.flag {
		color: var(--phosphor-faint);
	}

	@media (max-width: 720px) {
		.flag,
		.cell:nth-child(3) {
			display: none;
		}

		.wide {
			min-width: 0;
		}
	}
</style>
