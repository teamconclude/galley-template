# Shortcuts for working on the site by hand. Galley and CI run scripts/check
# directly, since make is missing on Macs without Apple's developer tools.
.PHONY: check server build

# Every check: components, images, and a build without errors or warnings.
check:
	scripts/check

# Preview at http://localhost:1313/ while editing.
server:
	hugo server

# The site, minified, in public/.
build:
	hugo --minify
