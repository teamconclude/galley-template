// Opens the question the address names, as in /about/#who-is-it-for, and puts an
// opened question's address in the location bar, so it can be shared. Like every
// component script it runs on every page, so it does nothing where there is no FAQ.
const entries = document.querySelectorAll('.c-faq-entry[id]')
if (entries.length > 0) {
  const openNamed = () => {
    const entry = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (entry && entry.matches('.c-faq-entry')) {
      entry.open = true
      entry.scrollIntoView()
    }
  }
  openNamed()
  addEventListener('hashchange', openNamed)
  for (const entry of entries) {
    entry.addEventListener('toggle', () => {
      if (entry.open) history.replaceState(null, '', `#${entry.id}`)
    })
  }
}
