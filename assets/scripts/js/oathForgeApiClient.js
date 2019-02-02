import oathForgeAddressHexUnprefixed from './oathForgeAddressHexUnprefixed.js'
import Token from './Token.js'

class OathForgeApiClient {
  constructor(oathForgeAddressHexUnprefixed) {
    this.oathForgeAddressHexUnprefixed = oathForgeAddressHexUnprefixed
    this.oathForgeApiUrl = `https://s3-us-west-2.amazonaws.com/oathforge-api/v0/mainnet/${oathForgeAddressHexUnprefixed}`
  }
  fetch() {
    return fetch(this.oathForgeApiUrl).then((response) => {
      return response.json()
    })
  }
  fetchTokens() {
    return this.fetch().then((data) => {
      return data.data.oathTokens.map((tokenData) => {
        return new Token(oathForgeAddressHexUnprefixed, tokenData)
      })
    })
  }
}

export default new OathForgeApiClient(oathForgeAddressHexUnprefixed)
