import accountsManager from './accountsManager.js'

export default function CryptoloanController($scope, $interval) {

  $scope.redditApiUrl = 'https://guildcrypt-reddit-api.herokuapp.com'

  const params = document.location.hash.substr(1).split('/')
  const step = params[1]

  if (step === 'reddit-linked') {
    const $reddit = document.getElementById('reddit')
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight + 1,
        behavior: 'smooth'
      })
    })
    localStorage.setItem('redditApi.user.cookie', params[2])
  }

  $scope.remainingView = 10000

  $scope.$watch('stats.score0ApprovalsCount', (score0ApprovalsCount) => {
    if (!score0ApprovalsCount) {
      return
    }
    const remaining = Math.max(0, 10000 - (score0ApprovalsCount * 5 ))
    const remainingViewStep = Math.ceil(($scope.remainingView - remaining) / 100)
    const interval = $interval(() => {
      if ($scope.remainingView <= remaining) {
        $interval.cancel(interval)
        $scope.remainingView = remaining
        return
      }
      $scope.remainingView = $scope.remainingView - remainingViewStep
    }, 10)

  })

  async function setUser() {
    const redditApiUserCookie = localStorage.getItem('redditApi.user.cookie')
    if (!redditApiUserCookie) {
      return
    }
    const fetchResult = await fetch(`${$scope.redditApiUrl}/me/${redditApiUserCookie}`)
    $scope.user = await fetchResult.json()
    $scope.$apply()
  }

  async function setStats() {
    const fetchResult = await fetch(`https://s3.amazonaws.com/cryptoloan-stats-api/stats.json`)
    $scope.stats = await fetchResult.json()

    $scope.stats.users.forEach((user) => {
      if (user.score0Info.isCalculated === false) {
        user.statusText = 'Analyzing Karma'
        return
      }
      if (user.score0Info.isApproved === false) {
        user.statusText = 'Rejected'
        return
      }
      if (user.isEthereumLinked === false) {
        user.statusText = 'Awaiting Ethereum address'
        return
      }
      user.statusText = 'Sending crypto'
    })
    $scope.$apply()
  }


  setUser()
  setStats()

  setInterval(() => {
    setUser()
    setStats()
  }, 1000)

  $scope.linkEthereumWallet = async () => {
    if (!accountsManager.defaultAddressHexUnprefixed) {
      try {
        await accountsManager.login()
      } catch(error) {
        alert('No Ethereum wallet detected. Please install Metamask')
        return
      }
    }
    if (!confirm(`Link ${accountsManager.defaultAddressHexUnprefixed} ?`)) {
      return
    }
    const redditApiUserCookie = localStorage.getItem('redditApi.user.cookie')
    await fetch(`${$scope.redditApiUrl}/me/addressHexUnprefixed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cookie: $scope.user.cookie,
        addressHexUnprefixed: accountsManager.defaultAddressHexUnprefixed
      })
    })
    await setUser()
  }

}
