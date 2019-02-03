import networkManager from './networkManager.js'

export class CouldNotEnableEthereumError extends Error {}
export class NoEthereumWalletDetectedError extends Error {}
export class NetworkMismatchError extends Error {}

class Web3Manager {
  fetchWeb3() {
    if (this.web3) {
      return Promise.resolve(this.web3)
    }

    return new Promise((resolve, reject) => {
      if (window.ethereum) {
          this.web3 = new Web3(ethereum)
          ethereum.enable().then(() => {
            resolve(this.web3)
          }, (error) => {
            reject(new CouldNotEnableEthereumError(error.message))
          })
        } else if (window.web3) {
          resolve(window.web3)
        }
        else {
          reject(new NoEthereumWalletDetectedError('No ethereum wallet detected'))
        }
    })
  }

  fetchContract(abi, addressHexUnprefixed) {
    return this.fetchWeb3().then((web3) => {
      if (web3.currentProvider.networkVersion !== networkManager.networkVersion) {
        throw new NetworkMismatchError(`Your ethereuem wallet is on the wrong network. It should be set to ${networkManager.network}.`)
      }
      return web3.eth.contract(abi).at(addressHexUnprefixed)
    })
  }

}

export default new Web3Manager
