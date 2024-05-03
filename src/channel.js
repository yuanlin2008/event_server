const path = require("path")
const querystring = require("querystring")
const WebSocket = require("websocket").w3cwebsocket

class Channel {
  constructor(baseURL, params, topic, hbTimeout, rcTimeout) {
    params = Object.assign({}, params, { vsn: "2.0.0" })
    const urlBase = new URL(path.join(baseURL, "websocket?")).toString()
    this.url = `${urlBase}${querystring.stringify(params)}`
    this.topic = topic
    this.hbTimeout = hbTimeout
    this.rcTimeout = rcTimeout
    this.cref = 0
    this.ref = 0
  }

  start() {
    this._connect()
  }

  close() {
    this._clearTimer()
    this._clearSocket()
  }

  send(event, payload) {
    this._send(this.topic, event, payload)
  }
  _send(topic, event, payload) {
    if (this.socket && this.socket.readyState === 1 /** OPEN */) {
      const msg = [this.cref, this._makeRef(), topic, event, payload]
      this.socket.send(JSON.stringify(msg))
    }
  }

  _onOpen() {
    this.send("phx_join", {})
    this.heartbeatPending = undefined
    this._startTimer(() => this._heartbeat(), this.hbTimeout)
    if (this.onOpen) {
      this.onOpen()
    }
  }
  _onError() {
    this._reconnect()
  }
  _onClose() {
    this._reconnect()
  }
  _onMessage(msg) {
    //console.log(msg.data)
    const [cref, ref, topic, event, payload] = JSON.parse(msg.data)
    if (topic === "phoenix" && ref === this.heartbeatPending) {
      this.heartbeatPending = undefined
    } else if (event === "phx_reply") {
      // channel opened or other reply.
    } else if (event === "phx_error" || event === "phx_close") {
      // channel error or close.
      this._reconnect()
    } else {
      if (this.onEvent) {
        this.onEvent(topic, event, payload)
      }
    }
  }
  _makeRef() {
    return this.ref++
  }
  _startTimer(callback, timeout) {
    this.timer = setTimeout(() => {
      this.timer = undefined
      callback()
    }, timeout)
  }
  _clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }
  _heartbeat() {
    if (this.heartbeatPending) {
      // heartbeat timeout.
      this._reconnect()
    } else {
      // send heartbeat
      this.heartbeatPending = this.ref
      this._send("phoenix", "heartbeat", {})
      this._startTimer(() => this._heartbeat(), this.hbTimeout)
    }
  }

  _connect() {
    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => this._onOpen()
    this.socket.onclose = () => this._onClose()
    this.socket.onerror = () => this._onError()
    this.socket.onmessage = (msg) => this._onMessage(msg)
  }

  _clearSocket() {
    if (this.socket) {
      this.socket.onerror = undefined
      this.socket.onopen = undefined
      this.socket.onclose = undefined
      this.socket.onmessage = undefined
      this.socket.close()
      this.socket = undefined
    }
  }

  _reconnect() {
    this.close()
    this._startTimer(() => this._connect(), this.rcTimeout)
  }
}

exports.Channel = Channel
