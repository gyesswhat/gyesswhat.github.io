# gyesswhat.dev

Gyeore Kim's portfolio. Concept: "follow the white rabbit."

## Development

```
npm install
npm run dev
```

Opens at **http://localhost:4000**.

## Editing content

All real content lives under `src/content/` — structured facts in JSON, long-form
writing in Markdown. Edit these files directly; no component code changes needed
for text updates.

### About — `src/content/about.json` + `about.md`

- `about.json`: `photo` (image path — not wired to an `<img>` yet, no real photo
  exists; see the comment in `AboutTab.tsx` for how to hook it up once one does),
  `oneLiner`, `bio` (filename, informational only, the actual text lives in the
  `.md` file)
- `about.md`: the paragraph shown as the detailed intro

### Experience — `src/content/experience.json`

Array of entries:

```json
{ "role": "Role", "org": "Organization", "start": "2025-01", "end": null }
```

`end: null` renders as "Present." Array order = left-to-right order on the
timeline.

### Projects — `src/content/projects.json` + `src/content/projects/<slug>.md`

`projects.json` is an array of project metadata:

```json
{
  "slug": "my-project",
  "title": "My Project",
  "tagline": "one-line description",
  "category": "engineering",
  "period": { "start": "2025-01", "end": null },
  "role": ["Role A"],
  "stack": ["Tech A", "Tech B"],
  "links": { "live": "https://...", "github": "https://..." },
  "order": 4
}
```

`category` is `"engineering"` or `"research"` — drives the filter tabs. `links`
fields are optional; omit `live`/`github` if there isn't one.

Each project's long-form write-up (shown in the detail modal, separate from the
metadata above) is a matching Markdown file: `src/content/projects/<slug>.md`.

**To add a project:** add an entry to `projects.json` with a new `slug`, and
create `src/content/projects/<slug>.md` — matched automatically by filename, no
import to wire up.

### Contact — `src/content/contact.json`

```json
{
  "email": "you@example.com",
  "phone": "+82 10-0000-0000",
  "instagram": "handle",
  "blog": "https://log.gyesswhat.dev",
  "github": "username"
}
```

`instagram`/`github` are just the handle/username (no `@`, no URL) — the links
are built automatically. Leave `email`/`phone` empty (`""`) to show a
placeholder instead.

## Notes

- Markdown bodies (About, Projects) are rendered as plain paragraphs split on
  blank lines — no markdown syntax (bold, links, headings, etc.) is parsed yet.
  Drop in a renderer like `react-markdown` later if you need real formatting.
