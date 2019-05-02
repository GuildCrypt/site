import networkManager from './networkManager.js'
import Token from './Token.js'
import EventEmitter from './EventEmitter.js'

export default class ApiClient extends EventEmitter {
  constructor(url) {
    super()
    this.url = url
    this.setData()
    setInterval(() => {
      this.setData()
    }, 5000)
  }
  fetch() {
    if(this.data) {
      return Promise.resolve(this.data)
    } else {
      return this.dataPromise
    }
  }
  setData() {
    this.dataPromise = fetch(this.url).then((response) => {
      return response.json()
    }).then((data) => {
      let prevData = this.data
      this.data = data
      if (!prevData || data.blockNumber > prevData.blockNumber) {
        this.emit('update', data)
      }
      return data
    })
  }
}
