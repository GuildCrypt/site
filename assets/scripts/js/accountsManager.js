import web3Manager from './web3Manager.js'
import EventEmitter from './EventEmitter.js'

export class NoWeb3Error extends Error {}
export class NotLoggedInError extends Error {}

class AccountsManager extends EventEmitter {

  constructor() {
    super()
    this.isLoggedIn = false
    if (window.web3 && window.web3.eth.defaultAccount) {
      this.setAccounts()
    }
  }

  login() {
    if (!window.web3 || !window.ethereum) {
      throw new NoWeb3Error
    }
    ethereum.enable().then(() => {
      this.setAccounts()
      this.emit('logged-in')
    })
  }

  setAccounts() {
    this.isLoggedIn = true
    this.defaultAddressHexUnprefixed = window.web3.eth.defaultAccount.substr(2).toLowerCase()
    this.addressesHexUnprefixed = window.web3.eth.accounts.map((addressHexPrefixed) => {
      return addressHexPrefixed.substr(2).toLowerCase()
    })
  }

  getIsControlling(addressHexUnprefixed) {
    if (!this.isLoggedIn) {
      throw new NotLoggedInError
    }
    return this.addressesHexUnprefixed.indexOf(addressHexUnprefixed.toLowerCase()) > -1
  }

}

export default new AccountsManager
