import networkManager from './networkManager.js'
import Token from './Token.js'
import EventEmitter from './EventEmitter.js'
import ApiClient from './ApiClient.js'
import riftpactforgeAbi from './riftpactforgeAbi.js'
import web3Manager from './web3Manager.js'

class RiftpactforgeApiClient extends ApiClient {
  constructor(network, riftpactforgeAddressHexUnprefixed) {
    super(`https://s3.amazonaws.com/riftpactforge-api/v0/${network}/${riftpactforgeAddressHexUnprefixed}`)
    this.riftpactforgeAddressHexUnprefixed = riftpactforgeAddressHexUnprefixed
  }
  async fetchRiftpactData(oathforgeAddressHexUnprefixed, idNumber) {
    const data = await this.fetch()
    return data.data.riftpacts.find((riftpact) => {
      if (riftpact.parentTokenHexUnprefixed !== oathforgeAddressHexUnprefixed) {
        return false
      }
      if (riftpact.parentTokenIdNumber !== idNumber) {
        return false
      }
      return true
    })
    if (!riftpactData) {
      throw new Error('No Riftpact')
    }
  }
}

export default new RiftpactforgeApiClient(networkManager.network, networkManager.getRiftpactforgeAddressHexUnprefixed())
