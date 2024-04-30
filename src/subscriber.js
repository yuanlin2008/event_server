const path = require("path")
const { Channel } = require("./channel")

class Subscriber {
  constructor(baseURL, userId, hbTimeout = 10000, rcTimeout = 2000) {
    const url = new URL(path.join(baseURL, "sub")).toString()
    this.channel = new Channel(url, `user:${userId}`, hbTimeout, rcTimeout)
    this.channel.onOpen = () => this._onOpen()
    this.channel.onEvent = (t, e, p) => this._onEvent(t, e, p)
    this.eventHandlers = new Map()
    this.targetHandlers = new Map()
  }

  start() {
    this.channel.start()
  }

  stop() {
    this.channel.stop()
  }

  subscribe(event, callback) {
    this.eventHandlers.set(event, callback)
  }

  unsubscribe(event) {
    if (event) {
      this.eventHandlers.delete(event)
    } else {
      this.eventHandlers.clear()
    }
  }

  subscribeTarget(target, event, callback) {
    if (!this.targetHandlers.has(target)) {
      // subscribe this target
      this.channel.send("subscribe", { targets: [target] })
      this.targetHandlers.set(target, new Map())
    }
    this.targetHandlers.get(target).set(event, callback)
  }

  unsubscribeTarget(target, event) {
    if (event === undefined) {
      this.targetHandlers.delete(target)
      return
    }
    if (!this.targetHandlers.has(target)) {
      return
    }
    const handlers = this.targetHandlers.get(target)
    handlers.delete(event)
    if (handlers.size === 0) {
      // unsub this target.
      this.channel.send("unsubscribe", { targets: [target] })
      this.targetHandlers.delete(target)
    }
  }

  _onOpen() {
    // resubscribe targets.
    if (this.targetHandlers.size > 0) {
      const targets = Array.from(this.targetHandlers.keys())
      this.channel.send("subscribe", { targets: targets })
    }
  }
  _onEvent(target, event, payload) {
    if (target !== this.channel.topic) {
      return
    }
    if (event === "_target_" && this.targetHandlers.has(payload.target)) {
      // target event.
      const targetHandler = this.targetHandlers.get(payload.target)
      if (targetHandler.has(payload.event)) {
        targetHandler.get(payload.event)(payload.payload.data)
      }
    } else if (this.eventHandlers.has(event)) {
      // user event.
      this.eventHandlers.get(event)(payload.data)
    }
  }
}

module.exports = Subscriber
