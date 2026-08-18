<script lang="ts">
	import { tick } from 'svelte';
	import PortfolioPage from '$lib/components/PortfolioPage.svelte';
	import { identity, meta } from '$lib/data/cv';
	import { viewMode } from '$lib/state/viewMode.svelte';

	let TerminalApp = $state<typeof import('$lib/components/TerminalApp.svelte').default>();

	// The terminal — chrome, session state, 3D scene — is fetched only once a
	// visitor explicitly asks for it. Everyone else never downloads it.
	$effect(() => {
		if (viewMode.current === 'terminal' && !TerminalApp) {
			import('$lib/components/TerminalApp.svelte').then((m) => {
				TerminalApp = m.default;
			});
		}
	});

	// Lock background scroll while the terminal overlay is open, and return
	// keyboard focus to the control that opened it when it closes.
	$effect(() => {
		document.body.classList.toggle('lock-scroll', viewMode.current === 'terminal');
		if (viewMode.current === 'page') {
			tick().then(() => {
				document.querySelector<HTMLElement>('.terminal-toggle')?.focus();
			});
		}
	});
</script>

<svelte:head>
	<title>Charlie Cohen — Windows kernel & EFI engineer</title>
	<meta name="description" content={meta.description} />
	<link rel="canonical" href="https://chuccle.github.io/" />

	<meta property="og:type" content="profile" />
	<meta property="og:title" content="Charlie Cohen — Windows kernel & EFI engineer" />
	<meta property="og:description" content={meta.description} />
	<meta name="twitter:card" content="summary_large_image" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: identity.name,
		jobTitle: 'Software Engineer',
		description: identity.statement,
		email: 'mailto:' + identity.email,
		url: identity.githubUrl,
		worksFor: { '@type': 'Organization', name: 'ESET Research UK' },
		knowsAbout: [
			'Windows kernel drivers',
			'EFI/UEFI pre-boot',
			'Full disk encryption',
			'Reverse engineering',
			'C',
			'C++',
			'Rust'
		]
	})}<\/script>`}
</svelte:head>

<!--
	inert (not just visual layering) keeps the page's links and skip-link out
	of the tab order and accessibility tree while the terminal overlay sits on
	top of it — otherwise a keyboard or screen-reader user could land on
	controls that aren't visually reachable.
-->
<div inert={viewMode.current === 'terminal'}>
	<PortfolioPage />
</div>

{#if viewMode.current === 'terminal' && TerminalApp}
	<TerminalApp />
{/if}
