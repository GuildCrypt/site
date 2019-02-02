import accountsManager from './accountsManager.js'

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

}
