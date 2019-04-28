const RSSParser = require("rss-parser")

// const parse  = promisify(parseString)
// const format = (json, type) => {
//   return json.rss.channel[0].item.map(item => {
//     return {
//       title: item.title[0] || "",
//       link:  item.link[0] || "",
//     }
//   })
// }

const parse  = (rss) => new RSSParser().parseString(rss)
const format = (json, type) => {
  const ctag = (type === "user") ? "content:encoded" : "description"
  return json.items.map(item => {
    return {
      date: new Date(item.isoDate),                                             // Date
      // Remove ?source=rss...
      link: item.link.split("?")[0],                                            // String (URL)
      // Expose `guid` field (perma/short link?)
      guid: item.guid,                                                          // String (URL|URI)
      title: item.title,                                                        // String
      // In RSS-land, the <dc:creator> tag is for the author's name while the
      // <author> tag is for the author's email address _and_ name. Wild, eh?
      author: item.creator,                                                     // String
      content: item[ctag],                                                      // String (HTML)
      categories: item.categories || []                                         // Array[String]
    }
  })
}
// Note the non-arrow to avoid lexical binding of `this` (it gets .call()'d)
const get = async function (url, type) {
  return this.fetch(url)
    .then(res  => res.text())
    .then(rss  => parse(rss))
    .then(json => format(json, type))
    .catch(err => err)
}


// const $      = (el, tag) => el.getElementsByTagName(tag)[0]
// const $$     = (el, tag) => el.getElementsByTagName(tag)
// const parse  = (xml) => new DOMParser().parseFromString(xml, "text/xml")
// const format = (xml, type) => {
//   const ctag = (type === "user") ? "content:encoded" : "description"
//   return Array.from($$(xml, "item")).map(item => {
//     return {
//       title: $(item, "title").childNodes[0].nodeValue,
//       link: $(item, "link").childNodes[0].nodeValue,
//       date: new Date($(item, "pubDate").childNodes[0].nodeValue),
//       author: $(item, "dc:creator").childNodes[0].nodeValue,
//       content: $(item, ctag).childNodes[0].nodeValue,
//       categories: $$(item, "category").map(c => c.textContent)
//     }
//   })
// }

const BASE = "https://medium.com/feed"
const PROXY = "https://cors.io/?"

export default class Meed {

  constructor(options = {}) {
    this.proxy = options.proxy || false
    // TODO: check for provided `fetch`, error otherwise
    // If available, use the global `fetch` definition
    this.fetch = (typeof self === "object" && typeof self.fetch === "function") ? self.fetch.bind(self) : options.fetch
  }

  async user (user) {

    if (!user) {
      throw new Error("User required")
    }

    const url = (this.proxy) ? `${PROXY}${BASE}/@${user}` : `${BASE}/@${user}`
    return get.call(this, url, "user")
  }
}
