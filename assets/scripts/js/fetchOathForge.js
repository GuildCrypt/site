import web3Manager from './web3Manager.js'
import networkManager from './networkManager.js'
import oathforgeAbi from './oathforgeAbi.js'

let oathforge

export default function fetchOathforge() {
  if (oathforge) {
    return Promise.resolve(oathforge)
  }
  return web3Manager.fetchContract(oathforgeAbi, `0x${networkManager.getOathforgeAddressHexUnprefixed()}`).then((_oathforge) => {
    oathforge = _oathforge
    return oathforge
  })
}
