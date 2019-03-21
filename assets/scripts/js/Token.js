import accountsManager from './accountsManager.js'
import watchManager from './watchManager.js'
import riftpactforgeApiClient from './riftpactforgeApiClient.js'
import fetchRiftpact from './fetchRiftpact.js'

export default class Token {

  constructor(oathforgeAddressHexUnprefixed, data) {
    this.oathforgeAddressHexUnprefixed = oathforgeAddressHexUnprefixed
    this.data = data
    this.redeemUrl = `https://redeem.guildcrypt.com/#${this.data.idNumber}`
    this.trackerUrl = `https://etherscan.io/token/0x${oathforgeAddressHexUnprefixed}?a=${this.data.idNumber}`
    this.buyUrl = `https://opensea.io/assets/0x${oathforgeAddressHexUnprefixed}/${this.data.idNumber}`
    this.tokenizer = {
      name: 'Pat Liu'
    }
    this.watchlistEndpoint = '/'
    this.stringId = `oath.${this.oathforgeAddressHexUnprefixed}.${this.data.idNumber}`
    this.isWatching = this.getIsWatching()
    this.isUsers = null
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

    if (days > 1) {
      return `${days} days`
    }
    if (hours > 1) {
      return `${hours} hours`
    }
    if (minutes > 1) {
      return `${minutes} minutes`
    }
    return '0'
  }

  getPrettyAuctionAllowedAt() {
    if (this.prettyAuctionAllowedAt) {
      return this.prettyAuctionAllowedAt
    }
    this.prettyAuctionAllowedAt = (new Date(this.riftpactData.auctionAllowedAtNumber * 1000)).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      seconds: 'numeric',
      timeZoneName: 'short'
    })
    return this.prettyAuctionAllowedAt
  }

  getIsWatching() {
    return watchManager.getIsWatching(this)
  }

  setIsWatching(isWatching) {
    this.isWatching = isWatching
    watchManager.setIsWatching(this, isWatching)
  }

  toggleIsWatching() {
    this.setIsWatching(!this.isWatching)
  }

  getIsUserOathOwner() {

    if (this.isUserOathOwner !== undefined) {
      this.isUserOathOwner = (this.data.ownerHexUnprefixed === accountsManager.defaultAddressHexUnprefixed)
    }

    if (!accountsManager.isLoggedIn) {
      throw new NotLoggedInError
    }

    this.isUserOathOwner = (this.data.ownerHexUnprefixed === accountsManager.defaultAddressHexUnprefixed)
    return this.isUserOathOwner
  }

  async fetchIsUsers() {

    if (this.isUsers !== null) {
      return this.isUsers
    }

    if (!accountsManager.isLoggedIn) {
      throw new NotLoggedInError
    }



    if (this.data.ownerHexUnprefixed === accountsManager.defaultAddressHexUnprefixed) {
      this.isUsers = true
      return this.isUsers
    }

    const riftpactData = await this.fetchRiftpactData()
    if (!riftpactData) {
      this.isUsers = false
      return this.isUsers
    }

    const riftpactBalanceNumber = await this.fetchRiftpactBalanceNumber()
    if (riftpactBalanceNumber > 0) {
      this.isUsers = true
    } else {
      this.isUsers = false
    }
    return this.isUsers
  }

  async fetchRiftpactData() {
    if (this.riftpactData) {
      return this.riftpactData
    }
    this.riftpactData = await riftpactforgeApiClient.fetchRiftpactData(this.oathforgeAddressHexUnprefixed,  this.data.idNumber)
    return this.riftpactData
  }

  async fetchRiftpact() {
    if (this.riftpact) {
      return this.riftpact
    }
    if (!accountsManager.isLoggedIn) {
      throw new NotLoggedInError
    }
    const riftpactData = await this.fetchRiftpactData()
    if (!riftpactData) {
      throw new Error
    }
    return fetchRiftpact(riftpactData.addressHexUnprefixed)
  }

  async fetchRiftpactBalanceNumber() {
    const riftpact = await this.fetchRiftpact()
    return new Promise((resolve, reject) => {
      riftpact.balanceOf(`0x${accountsManager.defaultAddressHexUnprefixed}`, (error, balance) => {
        if (error) {
          reject(error)
        } else {
          resolve(balance.toNumber())
        }
      })
    })
  }

}
