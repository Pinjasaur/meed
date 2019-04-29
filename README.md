<h1 align="center">
  <img src="/.github/meed.svg" alt="Meed" width="450">
</h1>

[![Travis](https://img.shields.io/travis/Pinjasaur/meed.svg)](https://travis-ci.org/Pinjasaur/meed)

Modern JS library for getting Medium RSS feeds (user, topic, or tag) as JSON. 
Targets modern browsers / Node.js with an API that utilizes [`fetch`][fetch]
along with [`async` / `await`][async].

Check out the [docs][docs].

## What

Get Medium RSS feeds as JSON. Check out [Ghosts/medium-feed][mf] because it may
suit your needs better.

## Why

Because [@Ghosts](https://github.com/Ghosts) was writing [medium-feed][mf]. ¯\\\_(ツ)_/¯

## How

Check out the [docs][docs] for more.

### Install

Via npm or unpkg:
- `npm install meed` / `yarn add meed`
- https://unpkg.com/meed

### Use

In a browser that supports [`fetch`][ciu-fetch] & [`async`/`await`][ciu-async]:

```js
const feed = new Meed()
const user = await feed.user("Medium")
```

or in Node.js (bring your own `fetch`):

```js
const Meed  = require("meed")
const fetch = require("node-fetch")

const feed = new Meed({ fetch })
const user = await feed.user("Medium")
```

### Proxy

For local(host) testing in a browser, you'll probably need a CORS proxy. Here's
a list: https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347

You can use one like so:

```js
new Meed({ proxy: "PROXY_URL" })
```

I've had good luck with https://cors-anywhere.herokuapp.com/.

Check out the [docs][docs] for more details.

## Who

[Paul Esch-Laurent](https://github.com/Pinjasaur).

## License

[MIT](https://pinjasaur.mit-license.org/2018).

[mf]: https://github.com/Ghosts/medium-feed
[docs]: https://pinjasaur.github.io/meed/

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[ciu-fetch]: https://caniuse.com/#feat=fetch
[ciu-async]: https://caniuse.com/#feat=async-functions
