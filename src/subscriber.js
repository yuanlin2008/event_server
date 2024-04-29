const WebSocket = require('websocket').w3cwebsocket

class Subscriber {
  constructor(endPoint, userId) {
    this.endPoint = endPoint
    this.channel = `user:${userId}`
    this.eventHandlers = new Map()
    this.targetHandlers = new Map()
    this.socket = null
  }

  start(){
    if(this.socket !== null){
      return;
    }
    const url = `${this.endPoint}/websocket?vsn=2.0.0`
    this.socket = new WebSocket(url)
    this.onopen = () => this._onOnpen()
  }

  stop(){
  }
  subscribe(event, callback) {
    this.eventHandlers.set(event, callback)
  }

  unsubscribe(event) {
    this.eventHandlers.delete(event)
  }

  subscribeTarget(target, event, callback) {
    if(!this.targetHandlers.has(target)){
      // todo: subscribe this target
      this.targetHandlers.set(target) = new Map()
    }
    this.targetHandlers.get(target).set(event, callback)
  }

  unsubscribeTarget(target, event = null) {
    if(event === null){
      this.targetHandlers.delete(target)
      return
    }
    if(!this.targetHandlers.has(target)){
      return
    }
    const handlers = this.targetHandlers.get(target)
    handlers.delete(event)
    if(handlers.size === 0) {
      // todo: unsub this target.
      this.targetHandlers.delete(target)
    }
  }
}

exports.Subscriber = Subscriber