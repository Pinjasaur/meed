const RSSParser = require("rss-parser")

const BASE  = "https://medium.com/feed"
const PROXY = "https://cors.io/?"

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
      // Sources: https://uly.io/as, https://uly.io/at
      author: item.creator,                                                     // String
      content: item[ctag],                                                      // String (HTML)
      categories: item.categories || []                                         // Array[String]
    }
  })
}
const check = (res) => {
  return new Promise((resolve, reject) => {
    if (!res.ok)
      throw new Error("Response not OK")

    if (!res.headers.get("Content-Type").toLowerCase().includes("text/xml"))
      throw new Error("Response not XML")

    resolve(res)
  })
}
// Note the non-arrow to avoid lexical binding of `this` (it gets .call()'d)
const get = function (url, type) {
  return this.fetch(url)
    .then(res  => check(res))
    .then(res  => res.text())
    .then(rss  => parse(rss))
    .then(json => format(json, type))
}

export default class Meed {

  constructor(options = {}) {
    this.proxy = options.proxy || false
    // TODO: check for provided `fetch`, error otherwise
    // If available, use the global `fetch` definition
    this.fetch = (typeof self === "object" && typeof self.fetch === "function") ? self.fetch.bind(self) : options.fetch
  }

  async user (user) {

    if (!user)
      throw new Error("User required")

    const url = (this.proxy) ? `${PROXY}${BASE}/@${user}` : `${BASE}/@${user}`
    return get.call(this, url, "user")
  }

  async topic (topic) {

    if (!topic)
      throw new Error("Topic required")

    const url = (this.proxy) ? `${PROXY}${BASE}/topic/${topic}` : `${BASE}/topic/${topic}`
    return get.call(this, url, "topic")
  }

  async tag (tag) {

    if (!tag)
      throw new Error("Tag required")

    const url = (this.proxy) ? `${PROXY}${BASE}/tag/${tag}` : `${BASE}/tag/${tag}`
    return get.call(this, url, "tag")
  }
}
