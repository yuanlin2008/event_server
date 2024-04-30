# Event Server

## 简介

一个简单的事件触发与监听服务器实现。

- Publisher:
  Publisher 负责发布事件
- Subscriber:
  Subscriber 负责监听并处理事件。使用一个 UserId 标识自己.
- Target: 自定义目标。Subscriber 可以订阅 Target 的事件，Publisher 可以发布 Target 的事件。

事件分为两类：

- Subscriber 事件: 此类事件仅与 Subscriber 用户本身相关.
- Target 事件: 所有监听此 Target 的 Subscriber 都会收到此类事件.

特性:

- Publisher 支持自动重连. 丢失链接状态下发布的事件会丢失。
- Subscriber 支持自动重连. **重连后所有的监听事件状态会自动恢复，不需要重新设置事件监听**.丢失链接状态下的事件会丢失.

## 安装

### DevContainer

使用 vscode devcontainer 中打开项目根目录

安装依赖 packages

```
mix deps.get
npm install
```

服务器启动

```
mix phx.server
```

运行测试

```
node test.js
```

### npm

EventServer 的 js API 可以从 npm 安装

```
npm install event-server_js
```

## 使用

_注意: Publisher 和 Subscriber 在不使用后需要调用 stop()停止._

### Publisher

```typescript
import { Publisher } from "event-server_js"

const publisher = new Publisher(
  "ws://localhost:4000", // Pub地址
  10000, // 心跳间隔(10s)
  1000 //重连间隔(1s)
)

publisher.start()

// 触发用户事件
publisher.event(
  123, // user id
  "test_event", // event name
  { a: 10, b: 2 } // event payload
)

// 触发Target事件
publisher.targetEvent(
  "guild:1234", // Target
  "test_event", // event name
  { a: 10, b: 2 } // event payload
)
```

### Subscriber

```typescript
import { Subscriber } from "event-server_js"

const subscriber = new Subscriber(
  "ws://localhost:5000", // Sub地址
  123, // user id.
  10000, // 心跳间隔(10s)
  1000 //重连间隔(1s)
)

subscriber.start()

// 订阅用户事件.
subscriber.subscribe("test_event", (payload) => {
  console.log(payload)
})

// 订阅Target事件.
subscriber.subscribeTarget("guild:1234", "test_event", (payload) => {
  console.log(payload)
})
```
