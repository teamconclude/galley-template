{{- /* The Markdown for one block: components/<name>/<name>.md when the component
       has one, else its title and text. Empty lines left by unset fields are
       collapsed, and the result is trimmed. */ -}}
{{- $name := .component -}}
{{- $path := printf "components/%s/%s.md" $name $name -}}
{{- $out := "" -}}
{{- if templates.Exists (printf "partials/%s" $path) -}}
  {{- $out = partial $path . -}}
{{- else -}}
  {{- with .title }}{{ $out = printf "## %s" . }}{{ end -}}
  {{- with .text }}{{ $out = printf "%s\n\n%s" $out . }}{{ end -}}
{{- end -}}
{{- $out = replaceRE `\n[ \t]*\n(\s*\n)+` "\n\n" (string $out) -}}
{{- return strings.TrimSpace $out -}}
