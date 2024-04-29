const { Socket } = require("./channel")

class Publisher extends Socket {
  constructor(endPoint) {
    super(endPoint, `pub`)
  }

  publish(target, event, payload) {}
}
