# supraman-web

The supraman.ai site: an Astro site built and hosted by the LarchSys CMS (tenant `supraman`, site `main`).
Every visible string is a CMS content key; the code holds no text. Read `node_modules/@cms/kit/README.md` first.

- `src/pages/index.astro`: the story (hero, six chapters on a commit-graph spine, little things, get it).
- `src/styles/global.css`: colours from Supraman's default theme, so screenshots sit in the page.
- `src/scripts/site.js`: reveal-on-scroll (hand-drawn strokes draw themselves), the spine, the Graph/Session swap.
- `public/shots/`: screenshots. Fixture or seed data only, never real projects, hosts or names.

Work: put a token with `git:read` (and `npm:read`) in `.cms/token` or `CMS_TOKEN`, `pnpm install`, then
`pnpm dev` (pulls the draft content, runs astro) or `pnpm check` (the build and the check the CMS runs).
Text changes: `content_set_many` (or `cms content push`), then `publish`; no commit needed.
Code changes: commit and `git push origin main`; the CMS builds it, `preview_get` shows it, `publish` makes it live.
