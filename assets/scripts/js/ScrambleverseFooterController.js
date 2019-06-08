export default function ScrambleverseFooterController($scope, $interval, $timeout) {
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
      }, 500)
    }, 5000)
  }

  $scope.go = function go() {
    window.location.href = '/scrambleverse/'
  }


  $timeout(() => {
    $scope.isVisible = true
    $timeout(() => {
      showAndHideNextImage()
    }, 1000)
  }, 500)
}
