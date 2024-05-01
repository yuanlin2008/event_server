const { Publisher, Subscriber } = require("./src/index")

const p1 = new Publisher("ws://localhost:4000", "12345")
const s1 = new Subscriber("ws://localhost:4000", 1)
const s2 = new Subscriber("ws://localhost:4000", 2)

p1.start()

s1.subscribe("userevent", (payload) => {
  console.log(`userevent received.${payload}`)
})
s1.subscribeTarget("target", "targetevent", (payload) => {
  console.log(`targetevent received.${payload}`)
})
s1.start()

s2.subscribeTarget("target", "targetevent", (payload) => {
  console.log(`targetevent received.${payload}`)
})
s2.start()

setInterval(() => {
  p1.event(1, "userevent")
}, 1000)

setInterval(() => {
  p1.targetEvent("target", "targetevent", [1, 2, 3, 4, 5, "haha"])
}, 1000)
