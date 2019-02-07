class NetworkManager {
  constructor() {

    let network = 'mainnet'

    if(document.cookie) {
      const cookieString = document.cookie.split(';').find((cookieString) => {
         return cookieString.indexOf('network=') === 0
      })
      if (cookieString) {
        network = cookieString.replace('network=', '')
      }
    }

    this.network = network
    this.setNetworkVersion(network)
  }

  toggleNetwork() {
    if (this.network === 'mainnet') {
      this.setNetwork('rinkeby')
    } else {
      this.setNetwork('mainnet')
    }
  }

  setNetwork(network) {
    document.cookie = `network=${network}`
    window.location.reload()
  }

  getOathForgeAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return 'a307b905140c82b37f2d7d806ef9d8858d30ac87'
    } else if (this.network === 'rinkeby') {
      return '8466730da0d53ceec0d1f564dd462713e676fca6'
    }
  }

  setNetworkVersion(network) {
    if (network === 'mainnet') {
      this.networkVersion = '1'
    } else if (network === 'rinkeby') {
      this.networkVersion = '4'
    }
  }

  getTransactionUrl(transactionIdHexUnprefixed) {
    const prefix = this.network === 'rinkeby' ? 'rinkeby.' : ''
    return `https://${prefix}etherscan.io/tx/0x${transactionIdHexUnprefixed}`
  }

  getAddressUrl(addressHexUnprefixed) {
    const prefix = this.network === 'rinkeby' ? 'rinkeby.' : ''
    return `https://${prefix}etherscan.io/address/0x${addressHexUnprefixed}`
  }

}

export default new NetworkManager
