const path = require("path")
const { Channel } = require("./channel")

class Publisher {
  constructor(baseURL, hbTimeout = 10000, rcTimeout = 2000) {
    const url = new URL(path.join(baseURL, "pub")).toString()
    this.channel = new Channel(url, `pub`, hbTimeout, rcTimeout)
  }

  start() {
    this.channel.start()
  }

  stop() {
    this.channel.stop()
  }

  event(userId, event, payload) {
    payload = payload === undefined ? null : payload
    this.channel.send("publish", {
      target: `user:${userId}`,
      event,
      payload,
    })
  }

  targetEvent(target, event, payload) {
    payload = payload === undefined ? null : payload
    this.channel.send("publish", {
      target,
      event,
      payload,
    })
  }
}

module.exports = Publisher
