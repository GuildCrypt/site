import EventEmitter from './EventEmitter.js'

class ModalManager extends EventEmitter {

  open(options) {
    this.emit('open', options)
  }
}

export default new ModalManager
