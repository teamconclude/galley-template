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
components/          One folder per component: schema, template, Markdown, styles
layouts/
  _default/          baseof.html (header and <main>), home, single and list layouts,
                     the Markdown renditions and the link render hook
  home.llms.txt      /llms.txt, written from data/llms.yaml
  partials/          content-blocks.html, component.html and the Markdown helpers
assets/css/style.css The stylesheet; imports each component's styles
data/
  authors.yaml       Authors offered in a post's `authors` field
  llms.yaml          The text of /llms.txt
static/images/       Images, referred to from pages as /images/…
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
  (templates) and `assets/components` (styles). Declaring mounts replaces Hugo's
  defaults, so the other folders are listed there too; add a line if you start
  using another one, such as `archetypes` or `i18n`.

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

4. **Add the styles**, `components/quote/quote.css`, and import them next to the
   other imports at the top of `assets/css/style.css`:

   ```css
   @import "components/quote/quote.css";
   ```

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

`.github/workflows/build.yml` builds the site with `hugo --minify` on every push
and pull request, so a broken template is caught before it is published.
