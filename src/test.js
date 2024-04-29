const { Subscriber } = require("./subscriber")

const s1 = new Subscriber("ws://localhost:4000/sub", "1")
const s2 = new Subscriber("ws://localhost:4000/sub", "2")

s1.subscribe("event1", (payload) => {
  console.log("s1 event1:" + payload)
})

s1.subscribeTarget("target1", "event1", (payload) => {
  console.log("s1 target event1:" + payload)
})
s1.start()
s2.subscribe("event1", (payload) => {
  console.log("s2 event1:" + payload)
})

s2.subscribeTarget("target1", "event1", (payload) => {
  console.log("s2 target event1:" + payload)
})
s2.start()

setInterval(() => {}, 1000)
