const { parseString } = require("xml2js")
const { promisify }   = require("util")

const parser = promisify(parseString)

const BASE = "https://medium.com/feed"
const PROXY = "https://cors.io/?"

export default class Meed {

  constructor(options = {}) {
    this.proxy = options.proxy || false
    // TODO: check for provided `fetch`, error otherwise
    // If available, use the global `fetch` definition
    this.fetch = (typeof self === "object" && typeof self.fetch === "function") ? self.fetch.bind(self) : options.fetch
  }

  async _xml2json (xml) {
    return
  }

  async user (user) {

    if (user === undefined) {
      throw "User required"
    }

    const url = (this.proxy) ? `${PROXY}${BASE}/@${user}` : `${BASE}/@${user}`

    return this.fetch(url)
      // .then(res => parseString(res))
      .then(res => res.text())
      .catch(err => err)
  }

}
