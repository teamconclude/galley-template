## {{ .title }}

{{ with .text }}{{ . }}{{ end }}

{{ with .buttons }}{{ partial "markdown/block.md" . }}{{ end }}
