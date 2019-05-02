import networkManager from './networkManager.js'
import Token from './Token.js'
import EventEmitter from './EventEmitter.js'
import ApiClient from './ApiClient.js'

class OathforgeApiClient extends ApiClient {
  constructor(network, oathforgeAddressHexUnprefixed) {
    super(`https://s3-us-west-2.amazonaws.com/oathforge-api/v0/${network}/${oathforgeAddressHexUnprefixed}`)
    this.oathforgeAddressHexUnprefixed = oathforgeAddressHexUnprefixed
  }
  fetchTokens() {
    return this.fetch().then((data) => {
      return data.data.oathTokens.map((tokenData) => {
        return new Token(this.oathforgeAddressHexUnprefixed, tokenData)
      })
    })
  }
}

export default new OathforgeApiClient(networkManager.network, networkManager.getOathforgeAddressHexUnprefixed())
