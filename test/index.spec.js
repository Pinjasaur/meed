const { expect } = require("chai")
const fetch      = require("node-fetch")
const to         = require("await-to-js").default
const Meed       = require("../dist/meed")

const feed = new Meed({ fetch })

describe("Meed", () => {

  it("exports a function", () => {

    expect(typeof Meed).to.equal("function")
  })

  it("exports an object when instantiated", () => {

    expect(typeof new Meed({ fetch })).to.equal("object")
  })

  it("errors if non-string `proxy`", () => {

    const fn = function () { new Meed({ proxy: true }) }
    expect(fn).to.throw(Error)
  })

  it("errors if no `fetch` (non-browser)", () => {

    const fn = function () { new Meed() }
    expect(fn).to.throw(Error)
  })

  describe("#user()", () => {

    it("rejects if no argument", async () => {

      const [err, user] = await to(feed.user())
      expect(err.message).to.equal("User required")
    })

    it("rejects if argument is empty string", async () => {

      const [err, user] = await to(feed.user(""))
      expect(err.message).to.equal("User required")
    })

    it("rejects if argument is not string", async () => {

      const [err, user] = await to(feed.user(123))
      expect(err.message).to.equal("User required")
    })

    it("resolves against a known user", async () => {

      const [err, user] = await to(feed.user("caden"))
      expect(typeof user).to.equal("object")
      expect(user.length).to.be.greaterThan(0)
    })

    it("rejects against an unknown user", async () => {

      const [err, user] = await to(feed.user("USER_DOES_NOT_EXIST"))
      expect(err.message).to.equal("Response not OK")
    })
  })

  describe("#topic()", () => {

    it("rejects if no argument", async () => {

      const [err, topic] = await to(feed.topic())
      expect(err.message).to.equal("Topic required")
    })

    it("rejects if argument is empty string", async () => {

      const [err, topic] = await to(feed.topic(""))
      expect(err.message).to.equal("Topic required")
    })

    it("rejects if argument is not string", async () => {

      const [err, topic] = await to(feed.topic(123))
      expect(err.message).to.equal("Topic required")
    })

    it("resolves against a known topic", async () => {

      const [err, topic] = await to(feed.topic("technology"))
      expect(typeof topic).to.equal("object")
      expect(topic.length).to.be.greaterThan(0)
    })

    it("rejects against an unknown topic", async () => {

      const [err, topic] = await to(feed.topic("TOPIC_DOES_NOT_EXIST"))
      expect(err.message).to.equal("Response not OK")
    })
  })

  describe("#tag()", () => {

    it("rejects if no argument", async () => {

      const [err, tag] = await to(feed.tag())
      expect(err.message).to.equal("Tag required")
    })

    it("rejects if argument is empty string", async () => {

      const [err, tag] = await to(feed.tag(""))
      expect(err.message).to.equal("Tag required")
    })

    it("rejects if argument is not string", async () => {

      const [err, tag] = await to(feed.tag(123))
      expect(err.message).to.equal("Tag required")
    })

    it("resolves against a known tag", async () => {

      const [err, tag] = await to(feed.tag("javascript"))
      expect(typeof tag).to.equal("object")
      expect(tag.length).to.be.greaterThan(0)
    })

    it("returns no items against an unknown tag", async () => {

      const [err, tag] = await to(feed.tag("TAG_DOES_NOT_EXIST"))
      expect(typeof tag).to.equal("object")
      expect(tag.length).to.be.equal(0)
    })
  })
})
