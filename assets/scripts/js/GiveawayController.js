function getTime() {
  return Math.floor((new Date).getTime() / 1000)
}

export default function GiveawayController($scope, $interval, $timeout) {

  $scope.redditApiUrl = 'http://localhost:5000'

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

  async function setUser() {
    const redditApiUserCookie = localStorage.getItem('redditApi.user.cookie')
    if (!redditApiUserCookie) {
      return
    }
    const fetchResult = await fetch(`${$scope.redditApiUrl}/me/${redditApiUserCookie}`)
    $scope.$apply()
  }

  async function setStats() {
    const fetchResult = await fetch(`https://s3.amazonaws.com/giveaway-stats-api/stats.json`)
    $scope.stats = await fetchResult.json()
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

    $flipper.classList.remove('flip-card-hover')
    const flipperSrc = `https://s3.amazonaws.com/giveaway-stats-api/cards/${giveaway.card.id}.jpeg`
    const imageLoader = new Image
    imageLoader.src = flipperSrc
    if (flipTimeout) {
      $timeout.cancel(flipTimeout)
    }
    flipTimeout = $timeout(() => {
      $scope.flipperSrc = flipperSrc
      $flipper.classList.add('flip-card-hover')
    }, giveawayWas ? 1000 : 0)

    if (!giveawayWas) {
      $timeout(() => {
        $scope.isGiveawayTransitioned = true
      }, 500)
    }
  })


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
    setUser()
    setStats()
  }, 1000)


}
