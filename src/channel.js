const WebSocket = require("websocket").w3cwebsocket

class Channel {
  constructor(endPoint, channel) {
    this.endPoint = endPoint
    this.channel = channel
    this.cref = 0
    this.ref = 0
    this._connect()
  }

  close() {
    this._clearSocket()
    this._clearHeartbeat()
    if (this.reconnecting) {
      clearTimeout(this.reconnecting)
      this.reconnecting = undefined
    }
  }

  send(event, payload) {
    this._send(this.channel, event, payload)
  }
  _send(topic, event, payload) {
    if (this.socket && this.socket.readyState === 1 /** OPEN */) {
      const msg = [this.cref, this._makeRef(), topic, event, payload]
      this.socket.send(JSON.stringify(msg))
    }
  }

  _onOpen() {
    console.log("OnOpen")
    this.send("phx_join", {})
  }
  _onError() {
    console.log("OnError")
    this._reconnect()
  }
  _onClose() {
    console.log("OnClose")
    this._reconnect()
  }
  _onMessage(msg) {
    const [cref, ref, topic, event, payload] = JSON.parse(msg.data)
  }
  _makeRef() {
    return this.ref++
  }
  _startHeartbeat() {
    const heartbeat = {}
    heartbeat.timer = setInterval(() => {
      heartbeat.acked = false
      heartbeat.ref = this.ref
      this._send("phoenix", "heartbeat", {})
    }, 5000)
    this.heartbeat = heartbeat
  }
  _clearHeartbeat() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat.timer)
      this.heartbeat = undefined
    }
  }

  _connect() {
    this.socket = new WebSocket(`${this.endPoint}/websocket?vsn=2.0.0`)
    this.socket.onopen = () => this._onOpen()
    this.socket.onclose = () => this._onClose()
    this.socket.onerror = () => this._onError()
    this.socket.onmessage = (msg) => this._onMessage(msg)
  }
  _clearSocket() {
    this.socket.onerror = undefined
    this.socket.onopen = undefined
    this.socket.onclose = undefined
    this.socket.onmessage = undefined
    this.socket.close()
    this.socket = undefined
  }
  _reconnect() {
    if (this.reconnecting) {
      return
    }
    this._clearSocket()
    this._clearHeartbeat()
    this.reconnecting = setTimeout(() => {
      this.reconnecting = undefined
      this._connect()
    }, 5000)
  }
}

exports.Channel = Channel
