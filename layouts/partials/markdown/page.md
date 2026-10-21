{{- /* The Markdown rendition of a page (index.html.md beside index.html): title,
       description, its blocks through each component's <name>.md, then the body. */ -}}
{{- $parts := slice (printf "# %s" .Title) -}}
{{- with .Description }}{{ $parts = $parts | append (printf "> %s" .) }}{{ end -}}
{{- if and .IsPage (eq .Section "blog") -}}
  {{- $meta := printf "Published: %s" (.Date.Format "2006-01-02") -}}
  {{- with .Params.authors }}{{ $meta = printf "%s  \nAuthors: %s" $meta (delimit . ", ") }}{{ end -}}
  {{- $parts = $parts | append $meta -}}
{{- end -}}
{{- range .Params.blocks -}}
  {{- with partial "markdown/block.md" . | strings.TrimSpace }}{{ $parts = $parts | append . }}{{ end -}}
{{- end -}}
{{- with .RawContent | strings.TrimSpace -}}
  {{- /* The NewTab link title is a hint for the HTML, not part of the text. */ -}}
  {{- $parts = $parts | append (replaceRE `\]\(([^)\s]*) +"NewTab"\)` "](${1})" .) -}}
{{- end -}}
{{- if .IsSection -}}
  {{- $list := slice -}}
  {{- range .RegularPages -}}
    {{- $line := printf "- [%s](%s)" .Title (.OutputFormats.Get "markdown").RelPermalink -}}
    {{- with .Description }}{{ $line = printf "%s: %s" $line . }}{{ end -}}
    {{- $list = $list | append $line -}}
  {{- end -}}
  {{- with $list }}{{ $parts = $parts | append (printf "## Pages\n\n%s" (delimit . "\n")) }}{{ end -}}
{{- end -}}
{{ delimit $parts "\n\n" }}
