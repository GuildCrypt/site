import web3Manager from './web3Manager.js'
import networkManager from './networkManager.js'
import riftpactAbi from './riftpactAbi.js'


export default function fetchRiftpact(riftpactAddressHexUnprefixed) {
  return web3Manager.fetchContract(riftpactAbi, `0x${riftpactAddressHexUnprefixed}`)
}
