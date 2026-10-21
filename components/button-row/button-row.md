{{- $lines := slice -}}
{{- range .buttons }}{{ with partial "markdown/block.md" . }}{{ $lines = $lines | append . }}{{ end }}{{ end -}}
{{ delimit $lines "\n" }}
