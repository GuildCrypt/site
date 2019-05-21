import modalManager from './modalManager.js'

function getTime() {
  return Math.floor((new Date).getTime() / 1000)
}

function openInviteModal() {
  modalManager.open({
    modalSize: 'lg',
    templateUrl: '/templates/modals/giveaway-invite.html',
    data: {
      redditApiUrl: $scope.redditApiUrl,
    }
  })
}

export default function GiveawayController($scope, $interval, $timeout) {

  //const redditApiUrl = 'https://guildcrypt-reddit-api.herokuapp.com'
  $scope.redditApiUrl = window.location.host.indexOf('localhost') === 0 ? 'http://localhost:5000' : 'https://guildcrypt-reddit-api.herokuapp.com'
  $scope.giveawayUrl = window.location.href.split('#')[0]

  $scope.getLoginUrl = (isSubscribe) => {
    const encodedCallbackUrl = encodeURIComponent($scope.giveawayUrl)
    const inviteCode = $scope.invite ? $scope.invite.inviteCode : ''
    return `${$scope.redditApiUrl}/auth/?callbackUrl=${encodedCallbackUrl}&subscribe=${isSubscribe ? 'yes' : 'no'}&inviteCode=${inviteCode}`
  }

  $scope.getInviteUrl = () => {
    return `${$scope.giveawayUrl}#/invite/${$scope.user.inviteCode}`
  }

  $scope.loginAndSubscribeUrl = $scope.getLoginUrl(true)

  async function setTime() {
    $scope.time = getTime()
  }

  async function setUser() {
    const redditApiUserCookie = localStorage.getItem('redditApi.user.cookie')
    if (!redditApiUserCookie) {
      return
    }
    const fetchResult = await fetch(`${$scope.redditApiUrl}/me/`, {
      headers: {
        authorization: redditApiUserCookie
      }
    })
    $scope.user = await fetchResult.json()
    $scope.$apply()
  }

  async function setStats() {
    const fetchResult = await fetch(`https://s3.amazonaws.com/giveaway-stats-api/stats.json`)
    $scope.stats = await fetchResult.json()
    $scope.stats.giveaways.forEach((giveaway) => {
      giveaway.drawingAtPretty = (new Date(giveaway.drawingAt * 1000)).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    })
    $scope.stats.tickets.forEach((ticket) => {
      switch(ticket.reasonCode) {
        case 'signup':
          ticket.reasonPretty = 'Signed up for Scrabbleverse'
          break;
        case 'reddit-subscribe':
          ticket.reasonPretty = 'Subscribed to /r/GuildCrypt'
          break;
        case 'invited':
          ticket.reasonPretty = `Invited /u/${ticket.invite.toUser.redditUsername}`
          break;
        case 'invited-by':
          ticket.reasonPretty = `Invited by /u/${ticket.invite.fromUser.redditUsername}`
          break;
        default:
          ticket.reasonPretty = ticket.reasonCode
          break;
      }
    })
    $scope.$apply()
  }

  $scope.$watch('giveawayIndex', (giveawayIndex) => {
    if (giveawayIndex === undefined) {
      return
    }
    $scope.giveaway = $scope.stats.giveaways[giveawayIndex]
  })

  let updateDrawingPojosInterval


  function updateDrawingPojos() {

    function getCharacters(value, length) {
      let string = value.toString()
      if (string.length < length) {
        const padding = '0'.repeat(length - string.length)
        string = `${padding}${string}`
      }
      return string.split('')
    }


    const time = getTime()
    if ($scope.giveaway.drawingAt <= time) {
      return
    } else {
      const diffSeconds = $scope.giveaway.drawingAt - time
      const seconds = diffSeconds % 60

      const diffMin = Math.floor(diffSeconds / 60)
      const minutes = diffMin % 60

      const diffHours = Math.floor(diffMin / 60)
      const hours = diffHours % 24

      const days = (diffHours - hours) / 24

      $scope.drawingPojos = [
        {
          key: 'days',
          value: days,
          characters: getCharacters(days, 2)
        },
        {
          key: 'hours',
          value: hours,
          characters: getCharacters(hours, 2)
        },
        {
          key: 'minutes',
          value: minutes,
          characters: getCharacters(minutes, 2)
        },
        {
          key: 'seconds',
          value: seconds,
          characters: getCharacters(seconds, 2)
        },
      ]
    }
  }

  const $flipper = document.getElementById('flipper')
  let flipTimeout

  $scope.$watch('giveaway', (giveaway, giveawayWas) => {
    if (giveaway === undefined) {
      return
    }
    if (updateDrawingPojosInterval) {
      $interval.cancel(updateDrawingPojosInterval)
    }
    if ($scope.giveaway.drawingAt > getTime()) {
      updateDrawingPojos()
      updateDrawingPojosInterval = $interval(updateDrawingPojos, 1000)
    } else {
      $scope.drawingPojos = null
    }

    // $flipper.classList.remove('flip-card-hover')
    const flipperSrc = `https://s3.amazonaws.com/giveaway-stats-api/cards/${giveaway.card.id}.jpeg`
    // const imageLoader = new Image
    // imageLoader.src = flipperSrc
    // // if (flipTimeout) {
    //   $timeout.cancel(flipTimeout)
    // }
    // flipTimeout = $timeout(() => {
      $scope.flipperSrc = flipperSrc
      // $flipper.classList.add('flip-card-hover')
    // }, giveawayWas ? 1000 : 0)

    if (!giveawayWas) {
      $timeout(() => {
        $scope.isGiveawayTransitioned = true
        $flipper.classList.add('flip-card-hover')
      }, 400)
    }
  })

  setTime()
  setUser()
  setStats().then(() => {
    const time = getTime()
    $scope.stats.giveaways.forEach((giveaway, index) => {
      if (giveaway.drawingAt < time) {
      $scope.giveawayIndex = index + 1
      }
    })
  })

  setInterval(() => {
    setTime()
    // setUser()
    setStats()
  }, 1000)


  $scope.login = function() {
    modalManager.open({
      modalSize: 'lg',
      templateUrl: '/templates/modals/login-with-reddit.html',
      data: {
        loginUrl: $scope.getLoginUrl(),
        loginAndSubscribeUrl: $scope.getLoginUrl(true)
      }
    })
  }

  $scope.openInviteModal = function() {
    modalManager.open({
      modalSize: 'lg',
      templateUrl: '/templates/modals/giveaway-invite.html',
      data: {
        inviteUrl: $scope.getInviteUrl(),
        user: $scope.user
      }
    })
  }

  async function handleStep() {

    const params = document.location.hash.substr(1).split('/')
    const step = params[1]

    if (step === 'reddit-linked') {
      localStorage.setItem('redditApi.user.cookie', params[2])
      window.location.hash = ''
      setUser()
      $scope.openInviteModal()
    }

    if (step === 'invite') {
      window.location.hash = ''
      const inviteCode = params[2]
      localStorage.setItem('inviteCode', inviteCode)
      const fetchResult = await fetch(`${$scope.redditApiUrl}/invites/${inviteCode}`)
      $scope.invite = await fetchResult.json()
      $scope.$apply()
    }

  }

  handleStep()



}
