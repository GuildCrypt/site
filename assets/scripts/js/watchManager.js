import emailServerUrl from './emailServerUrl.js'
import emailManager from './emailManager.js'

class WatchManager {
  getIsWatching(token) {
    return localStorage.getItem(`isWatching.${token.stringId}`) === 'true'
  }
  setIsWatching(token, isWatching) {
    return fetch(`${emailServerUrl}/v0/watchlist/oath`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        isWatching: isWatching,
        email: emailManager.get(),
        oathforgeAddressHexUnprefixed: token.oathforgeAddressHexUnprefixed,
        idNumber: token.data.idNumber
      })
    }).then(() => {
      localStorage.setItem(`isWatching.${token.stringId}`, isWatching ? 'true' : 'false')
    })
  }
}

export default new WatchManager()
