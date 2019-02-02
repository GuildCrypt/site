import { getWeb3, CouldNotEnableEthereumError, NoEthereumWalletDetectedError } from './web3.js'
import EventEmitter from './EventEmitter.js'

export class NoWeb3Error extends Error {}
export class NotLoggedInError extends Error {}

class AccountsManager extends EventEmitter {

  constructor() {
    super()
    this.isLoggedIn = false
    if (window.web3 && window.web3.eth.defaultAccount) {
      this.login()
    }
  }

  tryLogin() {
    return getWeb3().then(() => {
      return this.login()
    })
  }

  login() {
    if (!window.web3 || !window.ethereum) {
      throw new NoWeb3Error
    }
    ethereum.enable().then(() => {
      this.setAccounts(window.web3.eth.defaultAccount, window.web3.eth.accounts)
      this.isLoggedIn = true
      this.emit('logged-in')
    })
  }

  setAccounts(defaultAddressHexPrefixed, addressesHexPrefixed) {
    this.defaultAddressHexUnprefixed = defaultAddressHexPrefixed.substr(2).toLowerCase()
    this.addressesHexUnprefixed = addressesHexPrefixed.map((addressHexPrefixed) => {
      return addressHexPrefixed.substr(2).toLowerCase()
    })
    console.log(this.addressesHexUnprefixed)
  }

  getIsControlling(addressHexUnprefixed) {
    if (!this.isLoggedIn) {
      throw new NotLoggedInError
    }
    return this.addressesHexUnprefixed.indexOf(addressHexUnprefixed.toLowerCase()) > -1
  }

}

export default new AccountsManager
