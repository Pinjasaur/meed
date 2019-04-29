/**
 * NPM libs.
 */
const RSSParser = require("rss-parser")

/**
 * Constants.
 */
const BASE = "https://medium.com/feed"

/**
 * Functions.
 */

/**
 * Check a response before passing it off.
 * @param {Response} res A Response from a `fetch` call.
 */
const check = (res) => {
  if (!res.ok)
    throw new Error("Response not OK")

  if (!res.headers.get("Content-Type").toLowerCase().includes("text/xml"))
    throw new Error("Response not XML")

  return res.text()
}

/**
 * Parse a string as RSS.
 * @param {String} rss The RSS, as a string.
 */
const parse  = (rss) => new RSSParser().parseString(rss)

/**
 * Format the JSON feed.
 * @param {Object} json The JSON, as an object.
 * @param {String} type The type of feed: user|topic|tags.
 */
const format = (json, type) => {
  const ctag = (["user"].includes(type)) ? "content:encoded" : "description"
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

/**
 * Make a request for an RSS feed.
 * Note the non-arrow to avoid lexical binding of `this` (it gets .call()'d)
 * @param {String} url  The URL to request.
 * @param {String} type The type of feed: user|topic|tags.
 */
const get = function (url, type) {
  return this.fetch(url)
    .then(res  => check(res))
    .then(rss  => parse(rss))
    .then(json => format(json, type))
}

/**
 * Docs: https://help.medium.com/hc/en-us/articles/214874118-RSS-feeds
 * TODO: Meed#topics() all topics from: medium.com/topics
 * TODO: Meed#publication() w/ support for _optional_ tag
 */
/**
 * Meed itself.
 */
export default class Meed {

  /**
   * Kick-off a new instance of Meed.
   * @param {Object} options Any options to configure Meed.
   */
  constructor(options = {}) {

    this.proxy = options.proxy || false

    if (this.proxy !== false && typeof this.proxy !== "string")
      throw new Error("Proxy must be a string")

    // If available, use the global `fetch` definition (from a modern browser)
    this.fetch = (typeof self === "object" && typeof self.fetch === "function") ? self.fetch.bind(self) : options.fetch

    if (typeof this.fetch !== "function")
      throw new Error("Fetch must be a function")
  }

  /**
   * Get a user's feed.
   * @param {String} user The username.
   */
  async user (user) {

    if (!(typeof user === "string" && user.length > 0))
      throw new Error("User required")

    const url = (this.proxy) ? `${this.proxy}${BASE}/@${user}` : `${BASE}/@${user}`
    return get.call(this, url, "user")
  }

  /**
   * Get the feed for a topic.
   * @param {String} topic The topic (medium.com/topics).
   */
  async topic (topic) {

    if (!(typeof topic === "string" && topic.length > 0))
      throw new Error("Topic required")

    const url = (this.proxy) ? `${this.proxy}${BASE}/topic/${topic}` : `${BASE}/topic/${topic}`
    return get.call(this, url, "topic")
  }

  /**
   * Get the feed for a tag.
   * @param {String} tag The tag.
   */
  async tag (tag) {

    if (!(typeof tag === "string" && tag.length > 0))
      throw new Error("Tag required")

    const url = (this.proxy) ? `${this.proxy}${BASE}/tag/${tag}` : `${BASE}/tag/${tag}`
    return get.call(this, url, "tag")
  }
}
