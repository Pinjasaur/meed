const { expect } = require("chai")
const fetch = require("node-fetch")
const to    = require("await-to-js").default
const Meed  = require("../dist/meed")

const feed = new Meed({ fetch })

describe("Meed", () => {

  it("exports a function", () => {

    const result   = typeof Meed
    const expected = "function"
    expect(result).to.equal(expected)
  })

  it("exports an object when instantiated", () => {

    const result   = typeof new Meed()
    const expected = "object"
    expect(result).to.equal(expected)
  })

  describe("#user()", () => {

    it("resolves against a known user", async () => {

      const [err, user] = await to(feed.user("caden"))
      expect(typeof user).to.equal("object")
    })

    it("rejects against an unknown user", async () => {

      const [err, user] = await to(feed.user("DOES_NOT_EXIST"))
      expect(err.message).to.equal("Response not OK")
    })
  })
})
