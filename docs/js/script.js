;((document, window, undefined) => {

  "use strict";

  hljs.initHighlightingOnLoad()

  /**
   * Add the nice hash-link to headers.
   * Inspired by CodePen: https://blog.codepen.io/2016/11/17/anchor-links-post-headers/
   *
   * The main goal is to keep slugs as "clean" as possible:
   * 1. if possible, use the `id` already on the element
   * 2. if not, `slugify` the contents of the element
   * 3. check for any duplicates from the above steps
   * 4. finally, append a unique number to duplicates
   */

  const slugify = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, "-")     // Replace spaces with -
      .replace(/&/g, "-and-")   // Replace & with "and"
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-")   // Replace multiple - with single -
  }

  const $headers = Array.from(document.querySelectorAll("section h2, section h3"))

  // Get all slugs before doing anything else
  const slugs = $headers.map($header => $header.id || slugify($header.textContent))
  // Find duplicates (to make them unique later)
  const dupes = slugs.reduce((acc, slug, index, slugs) => slugs.indexOf(slug) !== index && acc.indexOf(slug) === -1 ? acc.concat(slug) : acc, [])
  // Seed the unique number
  let uniq = 0

  for (const $header of $headers) {
    let slug = $header.id || slugify($header.textContent)
    slug = (dupes.includes(slug)) ? `${slug}-${uniq++}` : slug
    const $link = document.createElement("a")
    $link.innerHTML = "#"
    $link.className = "header-hash"
    $link.href = `#${slug}`
    $link.id = slug
    $header.insertBefore($link, $header.firstChild)
  }

})(document, window)
