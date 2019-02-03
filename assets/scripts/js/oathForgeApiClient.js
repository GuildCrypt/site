import networkManager from './networkManager.js'
import Token from './Token.js'
import EventEmitter from './EventEmitter.js'

class OathForgeApiClient extends EventEmitter {
  constructor(network, oathForgeAddressHexUnprefixed) {
    super()
    this.network = network
    this.oathForgeAddressHexUnprefixed = oathForgeAddressHexUnprefixed
    this.oathForgeApiUrl = `https://s3-us-west-2.amazonaws.com/oathforge-api/v0/${this.network}/${this.oathForgeAddressHexUnprefixed}`
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
  fetchTokens() {
    return this.fetch().then((data) => {
      return data.data.oathTokens.map((tokenData) => {
        return new Token(this.oathForgeAddressHexUnprefixed, tokenData)
      })
    })
  }
  setData() {
    this.dataPromise = fetch(this.oathForgeApiUrl).then((response) => {
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

export default new OathForgeApiClient(networkManager.network, networkManager.getOathForgeAddressHexUnprefixed())
