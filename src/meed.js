const RSSParser = require("rss-parser")

const BASE  = "https://medium.com/feed"

const check = (res) => {
  if (!res.ok)
    throw new Error("Response not OK")

  if (!res.headers.get("Content-Type").toLowerCase().includes("text/xml"))
    throw new Error("Response not XML")

  return res.text()
}
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
// Note the non-arrow to avoid lexical binding of `this` (it gets .call()'d)
const get = function (url, type) {
  return this.fetch(url)
    .then(res  => check(res))
    .then(rss  => parse(rss))
    .then(json => format(json, type))
}

export default class Meed {

  constructor(options = {}) {

    this.proxy = options.proxy || false

    if (this.proxy !== false && typeof this.proxy !== "string")
      throw new Error("Proxy must be a string")

    // TODO: check for provided `fetch`, error otherwise
    // If available, use the global `fetch` definition
    this.fetch = (typeof self === "object" && typeof self.fetch === "function") ? self.fetch.bind(self) : options.fetch
  }

  async user (user) {

    if (!(typeof user === "string" && user.length > 0))
      throw new Error("User required")

    const url = (this.proxy) ? `${this.proxy}${BASE}/@${user}` : `${BASE}/@${user}`
    return get.call(this, url, "user")
  }

  async topic (topic) {

    if (!(typeof topic === "string" && topic.length > 0))
      throw new Error("Topic required")

    const url = (this.proxy) ? `${this.proxy}${BASE}/topic/${topic}` : `${BASE}/topic/${topic}`
    return get.call(this, url, "topic")
  }

  async tag (tag) {

    if (!(typeof tag === "string" && tag.length > 0))
      throw new Error("Tag required")

    const url = (this.proxy) ? `${this.proxy}${BASE}/tag/${tag}` : `${BASE}/tag/${tag}`
    return get.call(this, url, "tag")
  }
}
