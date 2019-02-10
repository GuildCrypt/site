import EventEmitter from './EventEmitter.js'

class ModalManager extends EventEmitter {

  open(options) {
    let resolve
    this.promise = new Promise((_resolve, reject) => {
      resolve = _resolve
    })
    this.promise.resolve = resolve
    this.emit('open', options)
    return this.promise
  }

  close() {
    this.emit('request-close')
  }

  closed(data) {
    this.promise.resolve(data)
  }
}

export default new ModalManager
