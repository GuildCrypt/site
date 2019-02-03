import web3Manager from './web3Manager.js'
import networkManager from './networkManager.js'
import oathForgeAbi from './oathForgeAbi.js'

let oathForge

export default function fetchOathForge() {
  if (oathForge) {
    return Promise.resolve(oathForge)
  }
  return web3Manager.fetchContract(oathForgeAbi, `0x${networkManager.getOathForgeAddressHexUnprefixed()}`).then((_oathForge) => {
    oathForge = _oathForge
    return oathForge
  })
}
