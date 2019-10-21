/**
 *
 * @class DevErrorObservable
 *
 * @description Observer, singleton.
 *
 */
export class DevErrorObservable {
  constructor() {
    if (DevErrorObservable.instance) return DevErrorObservable.instance
    DevErrorObservable.instance = this

    this.observers = []
    this.typedObservers = {}
  }

  /**
   *
   * @description Add the ability to subscribe to a new object essentially,
   * add something to the observers array.
   *
   * @param {function} cb - callback of subscription.
   * @param {string} type - key of grouped subscriptions.
   *
   */
  subscribe(cb, type) {
    if (type && typeof type === 'string') {
      this.typedObservers[type] = [].concat(this.typedObservers[type] || [], cb || [])
    } else {
      this.observers.push(cb)
    }
  }

  /**
   *
   * @description Add the ability to unsubscribe from a particular object essentially,
   * remove something from the observers array.
   *
   * @param {function} cb - callback of subscription.
   * @param {string} type - key of grouped subscriptions.
   *
   */
  unsubscribe(cb, type) {
    if (type && typeof type === 'string') {
      this.typedObservers[type] = []
        .concat(this.typedObservers[type] || [])
        .filter(subscriber => subscriber !== cb)
    } else {
      this.observers = this.observers.filter(subscriber => subscriber !== cb)
    }
  }

  /**
   *
   * @description Update all subscribed objects
   * and pass some data to each of them.
   *
   * @param {*} data - any data sent to subscription.
   * @param {string} [type] - key of grouped subscriptions.
   *
   */
  notify(data, type) {
    if (type && typeof type === 'string') {
      (this.typedObservers[type] || []).forEach(observer => observer(data))
    } else {
      this.observers.forEach(observer => observer(data))
    }
  }
}
