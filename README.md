# Galley template

A starter for [Hugo](https://gohugo.io/) sites edited with
[Galley](https://github.com/teamconclude/galley). Galley's **New site…** command
starts from this repository, but it is an ordinary Hugo site: you can also build
and edit it without Galley.

It follows [Galley's site contract](https://github.com/teamconclude/galley/blob/develop/docs/site-contract.md),
which describes what Galley reads from a site. Read it before changing the
configuration or the block partials.

## Running it

You need Hugo 0.168.0 or later. The standard edition is enough: styles are plain
CSS bundled by Hugo's `css.Build`, so neither Sass nor Hugo extended is needed.

```sh
hugo server     # preview at http://localhost:1313/
hugo --minify   # build into public/
scripts/check   # the checks below; also `make check`
```

`enableGitInfo` is on, so Hugo reads page dates from git and the site builds only
once the repository has at least one commit.

## Folder layout

```
hugo.yaml            Site configuration: title, menu, output formats, mounts
content/             Pages, in Markdown
  _index.md          The home page, built from blocks
  about/index.md     A plain Markdown page
  blog/              The blog: _index.md for the list, one file per post
components/          One folder per component: schema, template, Markdown, styles,
                     and a script where it needs one
layouts/
  _default/          baseof.html (header and <main>), home, single and list layouts,
                     the Markdown renditions and the link render hook
  home.llms.txt      /llms.txt, written from data/llms.yaml
  partials/          content-blocks.html, component.html and the Markdown helpers
assets/css/style.css The styles the whole site shares
data/
  authors.yaml       Authors offered in a post's `authors` field
  llms.yaml          The text of /llms.txt
static/images/       Images, referred to from pages as /images/…
scripts/check        The checks, which Galley runs before every commit
Makefile             Shortcuts: make check, make server, make build
```

A few things worth knowing:

- **Blocks.** A page built from blocks lists them under `blocks` in its
  frontmatter. Each block names its component in `component` and sets that
  component's fields. `layouts/partials/content-blocks.html` renders them one
  after the other, with a `<!--galley-block-->` comment before each so Galley can
  scroll its preview to the block being edited.
- **Markdown renditions.** Every page is also written as Markdown next to its
  HTML, as `index.html.md` (for example `/about/index.html.md`), for language
  models and for Galley's Markdown preview. `/llms.txt` links to them.
- **Links that open in a new tab** have the title `NewTab`:
  `[Hugo](https://gohugo.io/ "NewTab")`. The hook in
  `layouts/_default/_markup/render-link.html` turns that into `target="_blank"`.
- **Mounts.** `hugo.yaml` mounts `components/` into `layouts/partials/components`
  (templates) and `assets/components` (styles and scripts). Declaring mounts
  replaces Hugo's defaults, so the other folders are listed there too; add a line
  if you start using another one, such as `archetypes` or `i18n`.

## Components keep to themselves

Every component's styles and script live in its own folder, and the page head
bundles them all: one stylesheet, `assets/css/style.css` followed by each
`components/<name>/<name>.css`, and one script, `assets/js/site.js` (if there is
one) followed by each `components/<name>/<name>.js`. Nothing has to be listed
anywhere. So that components cannot get in each other's way:

- **Styles name the component.** Every selector at the top of `<name>.css`, or
  directly inside a top-level `@media`, `@supports`, `@container` or `@layer`,
  names the component's own class, `c-<name>` or `c-<name>-…` (or an element or id
  `<name>…`). Rules nested inside those may use short names. Animations are named
  the same way. Styles several components share go in `assets/css/style.css`.
- **Scripts run in a scope of their own.** Each `<name>.js` is wrapped in its own
  function, so its names are private. It runs on every page, so it must do nothing
  where the component is absent, and it attaches its event listeners itself:
  templates set no `onclick` and the like. Code several components share goes in
  `assets/js/site.js`. `faq.js` is an example: it opens the question the address
  names, as in `/#do-i-need-galley`.

`scripts/check-components` checks these rules, and that each component has its
schema and template.

## The components

| Component         | Fields and their types                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `hero`            | `title` text, `text` markdown, `image` image, `buttons` block (a button row)                                                 |
| `button-row`      | `alignment` select, `buttons` blocks (buttons only). Not standalone                                                          |
| `button`          | `label` text, `url` url, `style` select (required, with a default), `newTab` boolean. Not standalone                       |
| `section`         | `title` text, `body` markdown, `points` list of strings, `background` select                                                 |
| `image-with-text` | `image` image, `alt` text, `text` markdown, `imageSide` select, `width` number, `link` object (`label` text, `url` url)       |
| `faq`             | `title` text, `intro` textarea, `entries` list of objects (`question` text, `answer` markdown)                                |

Between them they use every field type Galley knows.

## Adding a component

Say you want a `quote` block with the quote and who said it.

1. **Make a folder** `components/quote/`. The folder name is the component's
   name, and the files in it share that name.

2. **Write the schema**, `components/quote/quote.yml`. It tells Galley which
   fields to show; Hugo does not read it.

   ```yaml
   label: Quote
   description: A quotation with its source.
   fields:
     text:
       type: markdown
       label: Quote
     author:
       label: Said by
       placeholder: Name, role
   ```

   A field without a `type` is a single line of text. The other types, and the
   `label`, `placeholder`, `help`, `default`, `required`, `options` and `standalone`
   keys, are described in the
   [site contract](https://github.com/teamconclude/galley/blob/develop/docs/site-contract.md#the-schema).

3. **Write the template**, `components/quote/quote.html`. It is a Hugo partial
   that gets the block's values as its context, so `.text` is the block's `text`.

   ```go-html-template
   <section class="c-quote">
     <blockquote class="container prose">
       {{ page.RenderString (dict "display" "block") .text }}
       {{ with .author }}<p class="c-quote-author">{{ . }}</p>{{ end }}
     </blockquote>
   </section>
   ```

   To render a nested block (a `block` or `blocks` field), pass it to
   `{{ partial "component.html" . }}`, as `hero.html` does.

4. **Add the styles**, `components/quote/quote.css`. They are picked up by
   themselves; name every top-level selector after the component, as in
   `.c-quote` and `.c-quote-author`.

   ```css
   .c-quote blockquote { margin: 0; font-size: 1.25rem; }
   .c-quote-author { color: var(--color-muted); }
   ```

   A component that needs a script gets `components/quote/quote.js` the same way.

5. **Optionally add the Markdown rendition**, `components/quote/quote.md`, used
   in the page's `index.html.md`. Without one, the block's `title` and `text` are
   used.

   ```
   > {{ .text }}
   >
   > — {{ .author }}
   ```

6. **Use it.** Galley picks up the new schema as soon as it is saved and offers
   **Quote** when you add a block. Without Galley, add it to a page by hand:

   ```yaml
   blocks:
     - component: quote
       text: Simplicity is prerequisite for reliability.
       author: Edsger W. Dijkstra
   ```

## Checks

`scripts/check` runs every check and says what is wrong when one fails:

- `scripts/check-components`: each component has its schema and template, and
  keeps to itself, as described above.
- `scripts/check-images`: every `/images/…` a page or data file names is in
  `static/images/`.
- A build without errors or warnings. The link render hook warns about a link to
  a path on the site that reaches no page, home page output or static file, so a
  broken link fails the check too. In the preview it is only a warning.

Galley runs `scripts/check` before every commit and shows the end of its output
when it fails, with the choice to commit anyway; Claude in Galley reads the same
output and can fix what it names. `.github/workflows/build.yml` runs it on every
push and pull request. It needs Hugo and `sh` only, since editors' Macs often have
no `make`, Node or Python. If you add a check that needs Node, add a
`package.json`: Galley then provides Node and installs the packages.
