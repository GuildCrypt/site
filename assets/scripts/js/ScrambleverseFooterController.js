import getCountdownPojos from './getCountdownPojos.js'
import getTime from './getTime.js'

let giveawayStats

async function fetchGiveawayStats() {
  if (giveawayStats) {
    return giveawayStats
  }
  const fetchResult = await fetch(`https://s3.amazonaws.com/giveaway-stats-api/stats.json?rand=${getTime()}`)
  giveawayStats = await fetchResult.json()
  return giveawayStats
}

async function getNextGiveawayAt() {
  const stats = await fetchGiveawayStats()
  const time = getTime()

  let giveawayIndex = 0
  stats.giveaways.forEach((giveaway, index) => {
    if (giveaway.drawingAt < time) {
      giveawayIndex = index + 1
    }
  })
  return stats.giveaways[giveawayIndex].drawingAt
}


export default async function ScrambleverseFooterController($scope, $interval, $timeout) {

  if(localStorage.getItem('redditApi.user.cookie')) {
    return
  }

  const imagesCount = 5
  let nextImageIndex = 0

  for (let i = 0; i < imagesCount; i++) {
    (new Image).src = `/assets/media/images/scrambleverse-footer-cards/${i}.jpeg`
  }


  function showAndHideNextImage() {
    $scope.flipCardSrc = `/assets/media/images/scrambleverse-footer-cards/${nextImageIndex}.jpeg`
    nextImageIndex = (nextImageIndex + 1) % imagesCount
    $scope.flipCardIsFaceUp = true
    $timeout(() => {
      $scope.flipCardIsFaceUp = false
      $timeout(() => {
        showAndHideNextImage()
      }, 1000)
    }, 7500)
  }

  $scope.go = function go() {
    window.location.href = '/scrambleverse/'
  }

  $scope.close = function close($event) {
    $scope.isVisible = false
    $event.stopPropagation()
  }

  async function setCountdownText() {
    const nextGiveawayAt = await getNextGiveawayAt()
    const countdownPojos = getCountdownPojos(nextGiveawayAt)

    $scope.countdownText = countdownPojos.map((countdownPojo) => {
      return `${countdownPojo.value} ${countdownPojo.key}`
    }).join(', ')
  }

  $interval(setCountdownText, 1000)
  setCountdownText()


  $timeout(() => {
    $scope.isVisible = true
    $timeout(() => {
      showAndHideNextImage()
    }, 1000)
  }, 500)
}
