import web3Manager from './web3Manager.js'
import EventEmitter from './EventEmitter.js'

export class NoWeb3Error extends Error {}
export class NotLoggedInError extends Error {}

const currentTosVersion = 2

class AccountsManager extends EventEmitter {

  constructor() {
    super()
    this.isLoggedIn = false
  }

  acceptTos() {
    localStorage.setItem('acceptedTosVersion', currentTosVersion)
  }

  getIsTosAccepted() {
    return this.getAcceptededTosVersion() >= currentTosVersion
  }

  async bootstrap() {
    if (!this.getIsTosAccepted()) {
      return
    }
    if (window.web3 && window.web3.eth.defaultAccount) {
      this.completeLogin()
    } else if (window.ethereum && localStorage.getItem('ethereum.isEnabled') === '1') {
      await window.ethereum.enable()
      this.completeLogin()
    }
  }

  async login() {
    this.acceptTos()
    if (window.web3 && window.web3.eth.defaultAccount) {
      this.completeLogin()
    } else if (window.ethereum) {
      await ethereum.enable()
      localStorage.setItem('ethereum.isEnabled', '1')
      this.completeLogin()
    } else {
      throw new NoWeb3Error
    }
  }

  getAcceptededTosVersion() {
    const acceptedTosVersionString = localStorage.getItem('acceptedTosVersion')
    if (acceptedTosVersionString === null || acceptedTosVersionString === '') {
      return 0
    }
    return parseInt(acceptedTosVersionString)
  }

  completeLogin() {
    this.isLoggedIn = true
    this.defaultAddressHexUnprefixed = window.web3.eth.defaultAccount.substr(2).toLowerCase()
    this.addressesHexUnprefixed = window.web3.eth.accounts.map((addressHexPrefixed) => {
      return addressHexPrefixed.substr(2).toLowerCase()
    })
    this.emit('logged-in')
  }

  getIsControlling(addressHexUnprefixed) {
    if (!this.isLoggedIn) {
      throw new NotLoggedInError
    }
    return this.addressesHexUnprefixed.indexOf(addressHexUnprefixed.toLowerCase()) > -1
  }

}

export default new AccountsManager
