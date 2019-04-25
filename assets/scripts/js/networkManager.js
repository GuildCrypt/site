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

    console.log('network', network)

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

  getOathforgeAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return 'd7b4a7d2bb0ffa29a7d2f17cd6b7e176c48060a6'
    } else if (this.network === 'rinkeby') {
      return '8466730da0d53ceec0d1f564dd462713e676fca6'
    }
  }

  getRiftpactforgeAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return '6e87624b3bc434cd708c2ca517541ddc89c7d5b3'
    } else if (this.network === 'rinkeby') {
      return 'd7b4a7d2bb0ffa29a7d2f17cd6b7e176c48060a6'
    }
  }

  getZocrAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return '288c0d7d39996049b3419f1C1Dc765235763bBFD'
    } else if (this.network === 'rinkeby') {
      return '02cfb71048a67a2a34b588b3e39f29d6434b6f67'
    }
  }

  getDaiAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return '89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
    } else if (this.network === 'rinkeby') {
      return 'e84a3d3c9ee3a8e44be4148982c3b1594b59f5a7'
    }
  }

  getExchangeAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return '4f833a24e1f95d70f028921e27040ca56e09ab0b'
    } else if (this.network === 'rinkeby') {
      return 'bce0b5f6eb618c565c3e5f5cd69652bbc279f44e'
    }
  }

  getErc20ProxyAddressHexUnprefixed() {
    if (this.network === 'mainnet') {
      return '2240dab907db71e64d3e0dba4800c83b5c502d4e'
    } else if (this.network === 'rinkeby') {
      return '2f5ae4f6106e89b4147651688a92256885c5f410'
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
