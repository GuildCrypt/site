import accountsManager from './accountsManager.js'
import watchManager from './watchManager.js'

export default class Token {

  constructor(oathForgeAddressHexUnprefixed, data) {
    this.oathForgeAddressHexUnprefixed = oathForgeAddressHexUnprefixed
    this.data = data
    this.redeemUrl = `https://redeem.guildcrypt.com/#${this.data.idNumber}`
    this.trackerUrl = `https://etherscan.io/token/0x${oathForgeAddressHexUnprefixed}?a=${this.data.idNumber}`
    this.buyUrl = `https://opensea.io/assets/0x${oathForgeAddressHexUnprefixed}/${this.data.idNumber}`
    this.tokenizer = {
      name: 'Pat Liu'
    }
    this.stringId = `oath.${this.oathForgeAddressHexUnprefixed}.${this.data.idNumber}`
    this.isWatching = this.getIsWatching()

    if (accountsManager.isLoggedIn) {
      this.isUsers = this.getIsOwned()
    }
  }

  getPrettySunsetLength() {
    if (this.prettySunsetLength) {
      return this.prettySunsetLength
    }
    let seconds = this.data.sunsetLengthNumber
    const days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    const hours   = Math.floor(seconds / 3600);
    seconds  -= hours*3600;
    const minutes = Math.floor(seconds / 60);
    seconds  -= minutes*60;

    if (days > 0) {
      return `${days} days`
    }
    if (hours > 0) {
      return `${days} hours`
    }
    if (minutes > 0) {
      return `${days} minutes`
    }
    return '0'
  }

  getIsOwned() {
    if (!accountsManager.isLoggedIn) {
      throw new NotLoggedInError
    }
    return accountsManager.getIsControlling(this.data.ownerHexUnprefixed)
  }

  getIsWatching() {
    return watchManager.getIsWatching(this.stringId)
  }

  setIsWatching(isWatching) {
    if (watchManager.getUserEmailAddress()) {
      return watchManager.setIsWatching(this.idString, isWatching)
    }
    return 
  }

}
