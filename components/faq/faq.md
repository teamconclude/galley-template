{{ with .title }}## {{ . }}{{ end }}

{{ with .intro }}{{ . }}{{ end }}
{{ range .entries }}
### {{ .question }}

{{ .answer }}
{{ end }}
