export type UserID = string | number
export type EventHandler = (payload: any) => void

/**
 * Publisher is used to trigger events.
 */
export class Publisher {
  /**
   * constructor
   * @param baseURL websocket base url, e.g, "ws://localhost:4000"
   * @param secret secret to login.
   * @param hbTimeout heartbeat timeout
   * @param rcTimeout reconnect timeout.
   */
  constructor(
    baseURL: string,
    secret: string,
    hbTimeout?: number,
    rcTimeout?: number
  )

  /**
   * Start working
   */
  start(): void

  /**
   * Start working
   */
  stop(): void

  /**
   * Trigger a user event.
   * @param userId user id.
   * @param event event name
   * @param payload event payload.
   */
  event(userId: UserID, event: string, payload?: any): void

  /**
   * Trigger a target event.
   * @param target target name
   * @param event event name
   * @param payload event payload.
   */
  targetEvent(target: string, event: string, payload?: any): void
}

/**
 * Subscriber is userd to subscribe and handle events.
 */
export class Subscriber {
  /**
   * constructor.
   * @param baseURL websocket base url, e.g, "ws://localhost:4000"
   * @param userId user id.
   * @param hbTimeout heartbeat timeout
   * @param rcTimeout reconnect timeout.
   */
  constructor(
    baseURL: string,
    userId: UserID,
    hbTimeout?: number,
    rcTimeout?: number
  )

  /**
   * Start working
   */
  start(): void
  /**
   * Stop working
   */
  stop(): void

  /**
   * Subscribe a user event.
   * @param event event name
   * @param handler event handler
   */
  subscribe(event: string, handler: EventHandler): void
  /**
   * Unsubscribe a user event.
   * @param event event name. undefined means all events of target.
   */
  unsubscribe(event?: string): void
  /**
   * Subscribe a target event.
   * @param target target name.
   * @param event event name
   * @param handler event handler
   */
  subscribeTarget(target: string, event: string, callback: EventHandler): void
  /**
   * Unsubscribe a target event
   * @param target target name
   * @param event event name. undefined means all events of target.
   */
  unsubscribeTarget(target: string, event?: string): void
}
