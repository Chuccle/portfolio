# Charlie Cohen — Portfolio

A CV site with two faces:

- **The page** (default) — a normal, accessible, fast-loading portfolio. No
  JavaScript required to read it; every route is prerendered static HTML.
- **The terminal** — an optional WinDbg-styled interactive mode, opened via
  the "Terminal mode" button. Nothing terminal-related (chrome, session
  state) loads until a visitor asks for it.

Built with SvelteKit 2, Svelte 5 (runes), and TypeScript. No server, no
database, no runtime dependencies beyond a font.

## Developing

```sh
npm install
npm run dev
```

## Checking & building

```sh
npm run check   # svelte-check + TypeScript
npm run build   # production build, written to build/
npm run preview # serve the production build locally
```

## Deployment

Static output deployed to [Vercel](https://vercel.com) via `vercel.json`
(build command `npm run build`, output directory `build`, no framework
preset — this is a plain static site, not a SvelteKit serverless
deployment). Push to `main` to deploy once the repo is connected to a
Vercel project.

`.github/workflows/ci.yml` runs type-checking and a production build on
every push and pull request, independent of Vercel's own deploy pipeline.

## Editing content

Everything text-based — identity, achievements, experience, skills,
projects, qualifications — lives in [`src/lib/data/cv.ts`](src/lib/data/cv.ts).
Both the page and the terminal render from that single source.
