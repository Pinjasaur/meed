;((document, window, undefined) => {

  "use strict";

  hljs.initHighlightingOnLoad()

  // Thanks CodePen: https://blog.codepen.io/2016/11/17/anchor-links-post-headers/
  const slugify = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, "-")     // Replace spaces with -
      .replace(/&/g, "-and-")   // Replace & with "and"
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-")   // Replace multiple - with single -
  }

  const $headers = document.querySelectorAll("section h2, section h3")

  $headers.forEach(($header, index) => {
    const slug  = $header.id || `${slugify($header.textContent)}-${index}`
    const $link = document.createElement("a")
    $link.innerHTML = "#&nbsp;"
    $link.className = "header-hash"
    $link.href = `#${slug}`
    $link.id = slug
    $header.insertBefore($link, $header.firstChild)
  })

})(document, window)
