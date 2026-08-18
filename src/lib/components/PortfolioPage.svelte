<script lang="ts">
	import {
		achievements,
		identity,
		projects,
		qualifications,
		roles,
		skillModules
	} from '$lib/data/cv';
	import { viewMode } from '$lib/state/viewMode.svelte';

	const role = roles[0];
	const openSource = projects.filter((p) => p.kind === 'open-source');
	const personal = projects.filter((p) => p.kind === 'personal');

	/**
	 * The same skill modules as the "Technical skills" list below, just
	 * reordered top-to-bottom by how close to the metal they sit — the
	 * throughline of the whole CV. No new claims, purely a different view
	 * of the same data.
	 */
	const depthOrder = ['frameworks', 'lang', 'toolchain', 'kerneldrv', 'secboot'];
	const layers = depthOrder
		.map((key) => skillModules.find((m) => m.module === key))
		.filter((m) => m !== undefined);

	function printCv() {
		window.print();
	}
</script>

<a class="skip-link" href="#main">Skip to main content</a>

<div class="page">
	<header class="site-header">
		<a class="brand" href="#top">Charlie Cohen</a>
		<nav aria-label="Page sections">
			<a href="#experience">Experience</a>
			<a href="#skills">Skills</a>
			<a href="#projects">Projects</a>
			<a href="#contact">Contact</a>
		</nav>
		<button type="button" class="terminal-toggle" onclick={() => viewMode.enterTerminal()}>
			<span aria-hidden="true">&gt;_</span> Terminal mode
		</button>
	</header>

	<main id="main">
		<section id="top" class="hero" aria-labelledby="hero-heading">
			<p class="eyebrow">Software Engineer</p>
			<h1 id="hero-heading">{identity.name}</h1>
			<p class="tagline">{identity.title}</p>
			<p class="lede">{identity.statement}</p>

			<div class="cta-row">
				<a class="btn btn-primary" href="mailto:{identity.email}">Email me</a>
				<a class="btn" href={identity.githubUrl}>GitHub ↗</a>
				<button type="button" class="btn" onclick={printCv}>Print / Save PDF</button>
			</div>

			<a class="depth-teaser" href="#skills" aria-label="Jump to the full skills breakdown">
				{#each layers as layer, i (layer.module)}
					<span class="depth-seg" style:--i={i}>{layer.label}</span>
				{/each}
			</a>
		</section>

		<section aria-labelledby="achievements-heading">
			<p class="eyebrow">Highlights</p>
			<h2 id="achievements-heading">Key achievements</h2>
			<div class="achievement-grid">
				{#each achievements as achievement (achievement.id)}
					<article class="card">
						<h3>{achievement.title}</h3>
						<p>{achievement.body}</p>
						<p class="impact">{achievement.impact}</p>
					</article>
				{/each}
			</div>
		</section>

		<section id="experience" aria-labelledby="experience-heading">
			<p class="eyebrow">Experience</p>
			<h2 id="experience-heading">Where I've worked</h2>
			<article class="role">
				<h3>{role.title} <span class="at">at</span> {role.company}</h3>
				<p class="period">{role.period}</p>
				<ul class="bullet-list">
					{#each role.frames as frame (frame.symbol)}
						<li>{frame.text}</li>
					{/each}
				</ul>
			</article>
		</section>

		<section id="skills" aria-labelledby="skills-heading">
			<p class="eyebrow">Skills</p>
			<h2 id="skills-heading">Under the hood</h2>
			<p class="lede">
				Most of my work sits below the layer most engineers spend their time in — the same
				breadth, read from the application down to the firmware.
			</p>

			<ol class="layers">
				{#each layers as layer (layer.module)}
					<li>
						<span class="layer-label">{layer.label}</span>
						<span class="layer-items">{layer.items.join(' · ')}</span>
					</li>
				{/each}
			</ol>

			<h3 class="group-heading">Full breakdown</h3>
			<div class="skill-groups">
				{#each skillModules as module (module.module)}
					<div class="skill-group">
						<h4>{module.label}</h4>
						<ul class="tag-list">
							{#each module.items as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<section id="projects" aria-labelledby="projects-heading">
			<p class="eyebrow">Projects</p>
			<h2 id="projects-heading">Open source &amp; personal work</h2>

			<h3 class="group-heading">Open source</h3>
			<div class="project-grid">
				{#each openSource as project (project.id)}
					<article class="card">
						<h4>{project.name}</h4>
						<p>{project.blurb}</p>
						<ul class="bullet-list">
							{#each project.details as detail (detail)}
								<li>{detail}</li>
							{/each}
						</ul>
						{#if project.pending}
							<p class="pending"><strong>In progress:</strong> {project.pending}</p>
						{/if}
						<ul class="tag-list">
							{#each project.stack as tech (tech)}
								<li>{tech}</li>
							{/each}
						</ul>
						{#each project.links as link (link.href)}
							<p><a href={link.href}>{link.label} ↗</a></p>
						{/each}
					</article>
				{/each}
			</div>

			<h3 class="group-heading">Personal</h3>
			<div class="project-grid">
				{#each personal as project (project.id)}
					<article class="card">
						<h4>{project.name}</h4>
						<p>{project.blurb}</p>
						<ul class="bullet-list">
							{#each project.details as detail (detail)}
								<li>{detail}</li>
							{/each}
						</ul>
						<ul class="tag-list">
							{#each project.stack as tech (tech)}
								<li>{tech}</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</section>

		<section aria-labelledby="education-heading">
			<p class="eyebrow">Education</p>
			<h2 id="education-heading">Qualifications</h2>
			<ul class="bullet-list">
				{#each qualifications as qualification (qualification.field)}
					<li>
						{qualification.field.replace(/([a-z])([A-Z])/g, '$1 $2')}: {qualification.value}
					</li>
				{/each}
			</ul>
		</section>

		<section id="contact" aria-labelledby="contact-heading">
			<p class="eyebrow">Get in touch</p>
			<h2 id="contact-heading">Contact</h2>
			<p class="lede">
				{identity.nationality} — always happy to talk about kernel work, EFI, or anything
				security-adjacent.
			</p>
			<div class="cta-row">
				<a class="btn btn-primary" href="mailto:{identity.email}">{identity.email}</a>
				<a class="btn" href={identity.githubUrl}>{identity.github}</a>
			</div>
		</section>
	</main>

	<footer class="site-footer">
		<p>
			Built with Svelte.
			<button type="button" class="link-button" onclick={() => viewMode.enterTerminal()}
				>Curious what the terminal mode looks like?</button
			>
		</p>
	</footer>
</div>

<style>
	.page {
		/* -------------------------------------------------------------
		   Near-black / off-white, restrained. Every pairing below clears
		   WCAG AA (4.5:1) by a wide margin — most clear AAA (7:1).
		   ------------------------------------------------------------- */
		--page-bg: #0a0a0b;
		--page-bg-elevated: #151517;
		--page-bg-inset: #1b1b1e;
		--page-border: rgba(255, 255, 255, 0.12);
		--page-fg: #efece6;
		--page-fg-muted: #a8a5a0;
		--page-accent: #7fb0b5;
		--page-key: #d9a04a;
		--page-ok: #8ba86b;

		min-height: 100dvh;
		background:
			repeating-linear-gradient(
				to bottom,
				color-mix(in oklab, var(--page-fg) 3%, transparent) 0,
				color-mix(in oklab, var(--page-fg) 3%, transparent) 1px,
				transparent 1px,
				transparent 40px
			),
			var(--page-bg);
		color: var(--page-fg);
		font-family: var(--ui);
		font-size: clamp(1.15rem, 0.3vw + 1.08rem, 1.25rem);
		line-height: 1.65;
	}

	.skip-link {
		position: absolute;
		left: 0.5rem;
		top: -3rem;
		z-index: 200;
		background: var(--page-key);
		color: #1a1206;
		padding: 0.6rem 1rem;
		border-radius: 3px;
		font-family: var(--ui);
		font-weight: 600;
		transition: top var(--dur-fast) var(--ease);
	}

	.skip-link:focus {
		top: 0.5rem;
	}

	/* ---------------- header ---------------- */

	.site-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 1.2rem;
		padding: 0.9rem clamp(1rem, 4vw, 3rem);
		background: color-mix(in oklab, var(--page-bg) 90%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--page-border);
	}

	.brand {
		font-family: var(--mono);
		font-weight: 700;
		color: var(--page-fg);
		border: none;
		font-size: 1.05rem;
		white-space: nowrap;
	}

	.site-header nav {
		display: flex;
		gap: 1.4rem;
		flex: 1;
		overflow-x: auto;
	}

	.site-header nav a {
		color: var(--page-fg-muted);
		border: none;
		font-size: 1rem;
		white-space: nowrap;
		padding: 0.3rem 0;
	}

	.site-header nav a:hover,
	.site-header nav a:focus-visible {
		color: var(--page-fg);
	}

	.terminal-toggle {
		display: flex;
		align-items: center;
		gap: 0.4ch;
		font-family: var(--mono);
		font-size: 0.92rem;
		color: var(--page-accent);
		border: 1px solid var(--page-border);
		padding: 0.5rem 0.85rem;
		border-radius: 3px;
		white-space: nowrap;
		flex-shrink: 0;
		transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
	}

	.terminal-toggle:hover,
	.terminal-toggle:focus-visible {
		background: color-mix(in oklab, var(--page-accent) 14%, transparent);
		color: var(--page-fg);
	}

	/* ---------------- layout rhythm ---------------- */

	main {
		max-width: 50rem;
		margin: 0 auto;
		padding: clamp(2rem, 5vw, 4rem) clamp(1.1rem, 4vw, 1.5rem) 2rem;
	}

	section {
		padding-block: clamp(2.4rem, 5vw, 3.6rem);
		border-bottom: 1px solid var(--page-border);
	}

	section:last-child {
		border-bottom: none;
	}

	.eyebrow {
		font-family: var(--mono);
		font-size: 1rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--page-accent);
		margin-bottom: 0.6rem;
	}

	h1,
	h2,
	h3,
	h4 {
		color: var(--page-fg);
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}

	h1 {
		font-size: clamp(2.6rem, 6vw, 3.75rem);
	}

	h2 {
		font-size: clamp(1.8rem, 3.6vw, 2.3rem);
	}

	h3 {
		font-size: 1.4rem;
		margin-top: 1.5rem;
	}

	h4 {
		font-size: 1.25rem;
	}

	.tagline {
		font-size: 1.35rem;
		color: var(--page-fg);
		margin-top: 0.6rem;
	}

	.lede {
		max-width: 62ch;
		margin-top: 1.2rem;
		color: var(--page-fg);
		font-size: 1.1rem;
	}

	p {
		max-width: 68ch;
	}

	/* ---------------- hero depth teaser ---------------- */

	.depth-teaser {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin-top: 2.4rem;
		border: none;
	}

	.depth-seg {
		font-family: var(--mono);
		font-size: 0.85rem;
		padding: 0.55rem 0.9rem;
		background: color-mix(in oklab, var(--page-bg-elevated) calc(100% - var(--i) * 8%), black);
		border-left: 2px solid
			color-mix(
				in oklab,
				var(--page-accent) calc(100% - var(--i) * 20%),
				var(--page-key) calc(var(--i) * 20%)
			);
		color: var(--page-fg-muted);
		transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
	}

	.depth-teaser:hover .depth-seg,
	.depth-teaser:focus-visible .depth-seg {
		color: var(--page-fg);
	}

	/* ---------------- CTAs ---------------- */

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		margin-top: 1.6rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4ch;
		min-height: 48px;
		padding: 0.7rem 1.25rem;
		border-radius: 4px;
		border: 1px solid var(--page-border);
		color: var(--page-fg);
		font-family: var(--ui);
		font-size: 1.05rem;
		font-weight: 600;
		background: var(--page-bg-elevated);
		transition: background var(--dur-fast) var(--ease);
	}

	.btn:hover,
	.btn:focus-visible {
		background: var(--page-bg-inset);
	}

	.btn-primary {
		background: var(--page-key);
		color: #1a1206;
		border-color: var(--page-key);
	}

	.btn-primary:hover,
	.btn-primary:focus-visible {
		background: color-mix(in oklab, var(--page-key) 85%, white 15%);
	}

	/* ---------------- "Under the hood" layers ---------------- */

	.layers {
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin-top: 1.6rem;
		counter-reset: layer;
	}

	.layers li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.9rem;
		padding: 0.85rem 1.1rem;
		background: var(--page-bg-elevated);
		border-left: 3px solid var(--page-accent);
	}

	/* Each layer down gets a touch darker and the accent shifts warmer,
	   so the list reads as descending toward the metal without needing
	   any image or canvas. */
	.layers li:nth-child(2) {
		background: color-mix(in oklab, var(--page-bg-elevated) 90%, black 10%);
	}
	.layers li:nth-child(3) {
		background: color-mix(in oklab, var(--page-bg-elevated) 80%, black 20%);
		border-left-color: color-mix(in oklab, var(--page-accent) 70%, var(--page-key) 30%);
	}
	.layers li:nth-child(4) {
		background: color-mix(in oklab, var(--page-bg-elevated) 70%, black 30%);
		border-left-color: color-mix(in oklab, var(--page-accent) 40%, var(--page-key) 60%);
	}
	.layers li:nth-child(5) {
		background: color-mix(in oklab, var(--page-bg-elevated) 60%, black 40%);
		border-left-color: var(--page-key);
	}

	.layer-label {
		font-family: var(--mono);
		font-weight: 700;
		color: var(--page-fg);
		font-size: 1.05rem;
	}

	.layer-items {
		color: var(--page-fg-muted);
		font-size: 1rem;
	}

	.skill-groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
		gap: 1.3rem;
		margin-top: 1.2rem;
	}

	/* ---------------- achievement + project cards ---------------- */

	.achievement-grid,
	.project-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
		gap: 1.1rem;
		margin-top: 1.3rem;
	}

	.card {
		background: var(--page-bg-elevated);
		border: 1px solid var(--page-border);
		border-radius: 6px;
		padding: 1.3rem 1.4rem;
	}

	.card h3,
	.card h4 {
		margin-top: 0;
	}

	.card p {
		margin-top: 0.6rem;
		font-size: 1.02rem;
		color: var(--page-fg);
	}

	.impact {
		margin-top: 0.8rem;
		color: var(--page-ok);
		font-size: 1rem;
		font-weight: 600;
	}

	.pending {
		margin-top: 0.7rem;
		font-size: 0.98rem;
		color: var(--page-key);
	}

	.group-heading {
		margin-top: 2rem;
		color: var(--page-fg-muted);
		font-family: var(--mono);
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* ---------------- lists ---------------- */

	.bullet-list {
		margin-top: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.bullet-list li {
		padding-left: 1.3em;
		position: relative;
		font-size: 1.05rem;
	}

	.bullet-list li::before {
		content: '';
		position: absolute;
		left: 0.15em;
		top: 0.68em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--page-accent);
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.7rem;
	}

	.tag-list li {
		font-family: var(--mono);
		font-size: 0.92rem;
		color: var(--page-fg);
		background: var(--page-bg-inset);
		border: 1px solid var(--page-border);
		border-radius: 999px;
		padding: 0.32rem 0.8rem;
	}

	.period {
		color: var(--page-fg-muted);
		font-size: 1rem;
		margin-top: 0.2rem;
	}

	.at {
		color: var(--page-fg-muted);
		font-weight: 400;
	}

	/* ---------------- footer ---------------- */

	.site-footer {
		max-width: 50rem;
		margin: 0 auto;
		padding: 2rem clamp(1.1rem, 4vw, 1.5rem) 3rem;
		color: var(--page-fg-muted);
		font-size: 0.95rem;
	}

	.link-button {
		color: var(--page-accent);
		border-bottom: 1px dotted color-mix(in oklab, var(--page-accent) 55%, transparent);
		font: inherit;
	}

	.link-button:hover,
	.link-button:focus-visible {
		color: var(--page-fg);
	}

	/* ---------------- mobile ---------------- */

	@media (max-width: 640px) {
		.site-header nav {
			display: none;
		}

		.terminal-toggle span {
			display: none;
		}

		.layers li {
			flex-direction: column;
			gap: 0.2rem;
		}
	}

	/* ---------------- print ---------------- */

	@media print {
		.site-header,
		.site-footer,
		.terminal-toggle,
		.skip-link,
		.cta-row {
			display: none;
		}

		.page {
			background: #fff;
			color: #000;
		}

		main {
			max-width: 100%;
			padding: 0;
		}

		h1,
		h2,
		h3,
		h4 {
			color: #000;
		}

		.eyebrow {
			color: #444;
		}

		section {
			border-bottom: none;
			padding-block: 0.9rem;
			break-inside: avoid;
		}

		.card {
			background: none;
			border: none;
			padding: 0;
			break-inside: avoid;
		}

		.achievement-grid,
		.project-grid {
			display: block;
		}

		.achievement-grid > *,
		.project-grid > * {
			margin-bottom: 1rem;
		}

		.tag-list li {
			background: none;
			border: 1px solid #999;
			color: #000;
		}

		.layers li {
			background: none !important;
			border-left: 2px solid #000;
		}

		.layer-items {
			color: #333;
		}

		a {
			color: #000;
		}
	}
</style>
