{{ with .image }}![{{ $.alt }}]({{ . }}){{ end }}

{{ with .text }}{{ . }}{{ end }}

{{ with .link }}{{ if and .label .url }}[{{ .label }}]({{ .url }}){{ end }}{{ end }}
