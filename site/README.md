# libui documentation site

The landing page and the documentation of libui. The site is a libui app: its frame is `AppShell`,
`TopBar`, `InnerMenu` and `MobileNav`, its search is `CommandMenu`, and every demo runs the current
sources of the library (`ferry-ui` resolves to `../src`).

```sh
npm run site:dev       # http://localhost:5181
npm run site:build     # static pages in site/dist
npm run site:preview   # serves site/dist on http://localhost:4181
npm run site:verify    # every check, then the build
```

All commands run from the repository root. The site has no `package.json` of its own: its tools are
`devDependencies` of the library.

## What is where

```text
site/
├─ AUTHORING.md              how to write a page: structure, demos, Simplified Technical English
├─ index.html                the HTML shell
├─ vite.config.ts            Vite + MDX + Tailwind, the `ferry-ui` alias
├─ lib/                      reads the pages (front matter, headings) and writes their Markdown version
├─ plugins/                  Vite / MDX plugins: the page list, <Demo> and <PropsTable>, the .md files
├─ scripts/
│  ├─ generate-api.mjs       props of every component, from the TypeScript sources → src/generated/api
│  ├─ check-content.mjs      the writing rules (ASD-STE100), the word budget, the links
│  └─ prerender.mjs          writes each page as a static HTML file after the build
└─ src/
   ├─ content/               the pages (.mdx): overview, handbook, examples, components, utilities
   ├─ demos/                 the live examples (.tsx), one folder per page
   ├─ components/docs/       the docs frame and the MDX blocks (Demo, PropsTable, Code, PackageTabs)
   ├─ components/landing/    the sections of the landing page
   ├─ pages/                 landing page, demo frame (/frame/?demo=…), not found
   ├─ app.tsx                the routes
   ├─ main.tsx               browser entry (hydrates the static page)
   └─ entry-server.tsx       server entry used by the build to render each page
```

## How a page is made

A page is one `.mdx` file with a front matter. Nothing else lists it: the sidebar, the search, the
"on this page" links, the previous / next links, the Markdown version (`/docs/…/<page>.md`) and
`/llms.txt` come from the files.

- `<Demo name="button/variants" />` shows `src/demos/button/variants.tsx` live, with its source.
- `<Demo name="app-shell/basic" frame />` runs the demo in an iframe with desktop, tablet and phone widths.
- `<PropsTable of="Button" />` shows the props read from the component's types and JSDoc.

Read [AUTHORING.md](./AUTHORING.md) before you write or change a page.

## Checks

| Command | What it checks |
| --- | --- |
| `npm run site:typecheck` | Types of the site and of every demo |
| `npm run site:test` | Every demo renders in the browser and on the server with no console error (`DEMOS=button npm run site:test` for a few) |
| `npm run site:check` | The writing rules: at least 80% of the sentences of each page obey the main rules of ASD-STE100. `-- -v` prints each sentence that fails, `-- --links` checks the links between pages, `-- --strict` fails when a page is below the target |
| `npm run site:build` | The build fails when a page names a demo or a component that does not exist, or when a page cannot render |
| `npm run lint` | ESLint covers `site/` too |

The writing check is a heuristic. It knows the sentence rules and a short list of words that STE does
not approve; it does not have the STE dictionary.

## Deploy

`npm run site:build` writes a static site in `site/dist`: one HTML file per page, the assets, a
Markdown file per page and `llms.txt`. Any static host can serve it.

- Build command: `npm ci && npm run site:build`. Publish directory: `site/dist`.
- Served from a sub-path (for example GitHub Pages at `/libui/`)? Build with `SITE_BASE=/libui/`.
- `404.html` is the page a static host shows for an unknown address.
