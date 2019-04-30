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

    it("rejects if no user", async () => {

      const [err, user] = await to(feed.user())
      expect(err.message).to.equal("User is required and must be a string")
    })

    it("rejects if user is empty string", async () => {

      const [err, user] = await to(feed.user(""))
      expect(err.message).to.equal("User is required and must be a string")
    })

    it("rejects if user is not string", async () => {

      const [err, user] = await to(feed.user(123))
      expect(err.message).to.equal("User is required and must be a string")
    })

    it("resolves against a known user", async () => {

      const [err, user] = await to(feed.user("Medium"))
      expect(typeof user).to.equal("object")
      expect(user.length).to.be.greaterThan(0)
    })

    it("rejects against an unknown user", async () => {

      const [err, user] = await to(feed.user("USER_DOES_NOT_EXIST"))
      expect(err.message).to.equal("Response code not OK: 404")
    })
  })

  describe("#publication()", () => {

    it("rejects if no publication", async () => {

      const [err, publication] = await to(feed.publication())
      expect(err.message).to.equal("Publication is required and must be a string")
    })

    it("rejects if publication is empty string", async () => {

      const [err, publication] = await to(feed.publication(""))
      expect(err.message).to.equal("Publication is required and must be a string")
    })

    it("rejects if publication is not string", async () => {

      const [err, publication] = await to(feed.publication(123))
      expect(err.message).to.equal("Publication is required and must be a string")
    })

    it("rejects if tag is empty string", async () => {

      const [err, publication] = await to(feed.publication("the-story", ""))
      expect(err.message).to.equal("Tag must be a string")
    })

    it("rejects if tag is not string", async () => {

      const [err, publication] = await to(feed.publication("the-story", 123))
      expect(err.message).to.equal("Tag must be a string")
    })

    it("resolves against a known publication", async () => {

      const [err, publication] = await to(feed.publication("the-story"))
      expect(typeof publication).to.equal("object")
      expect(publication.length).to.be.greaterThan(0)
    })

    it("rejects against an unknown publication", async () => {

      const [err, publication] = await to(feed.publication("PUBLICATION_DOES_NOT_EXIST"))
      expect(err.message).to.equal("Response code not OK: 404")
    })
  })

  describe("#topic()", () => {

    it("rejects if no topic", async () => {

      const [err, topic] = await to(feed.topic())
      expect(err.message).to.equal("Topic is required and must be a string")
    })

    it("rejects if topic is empty string", async () => {

      const [err, topic] = await to(feed.topic(""))
      expect(err.message).to.equal("Topic is required and must be a string")
    })

    it("rejects if topic is not string", async () => {

      const [err, topic] = await to(feed.topic(123))
      expect(err.message).to.equal("Topic is required and must be a string")
    })

    it("resolves against a known topic", async () => {

      const [err, topic] = await to(feed.topic("technology"))
      expect(typeof topic).to.equal("object")
      expect(topic.length).to.be.greaterThan(0)
    })

    it("rejects against an unknown topic", async () => {

      const [err, topic] = await to(feed.topic("TOPIC_DOES_NOT_EXIST"))
      expect(err.message).to.equal("Response code not OK: 404")
    })
  })

  describe("#topics()", () => {

    it("gets topics", async () => {

      const [err, topics] = await to(feed.topics())
      expect(typeof topics).to.equal("object")
      expect(topics.length).to.be.greaterThan(0)
    })
  })

  describe("#tag()", () => {

    it("rejects if no tag", async () => {

      const [err, tag] = await to(feed.tag())
      expect(err.message).to.equal("Tag is required and must be a string")
    })

    it("rejects if tag is empty string", async () => {

      const [err, tag] = await to(feed.tag(""))
      expect(err.message).to.equal("Tag is required and must be a string")
    })

    it("rejects if tag is not string", async () => {

      const [err, tag] = await to(feed.tag(123))
      expect(err.message).to.equal("Tag is required and must be a string")
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
