export default function CryptoloanController($scope, $interval) {
  $scope.remaining = 8335
  $scope.remainingView = 10000

  const step = Math.ceil(($scope.remainingView - $scope.remaining) / 100)

  const interval = $interval(() => {
    if ($scope.remainingView <= $scope.remaining) {
      $interval.cancel(interval)
      $scope.remainingView = $scope.remaining
      return
    }
    $scope.remainingView = $scope.remainingView - step
  }, 10)

  $scope.goDown = function goDown() {
    console.log({
      top: window.innerHeight + 49,
      left: window.scrollX,
      behavior: 'smooth'
    })
    window.scrollTo({
      top: window.innerHeight + 49,
      left: window.scrollX,
      behavior: 'smooth'
    })
  }

}
