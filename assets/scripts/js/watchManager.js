class WatchManager {
  constructor(emailServerUrl) {
    this.emailServerUrl = emailServerUrl
  }
  getUserEmailAddress() {
    return localStorage.getItem('userEmailAddress')
  }
  getIsWatching(stringId) {
    return localStorage.getItem(`isWatching.${stringId}`) === 'true'
  }
  setIsWatching(stringId, isWatching) {
    return localStorage.setItem(`isWatching.${stringId}`, isWatching ? 'true' : 'false')
  }
}

export default new WatchManager('http://localhost:8080')
