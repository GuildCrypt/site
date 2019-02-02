import modalManager from './modalManager.js'

export default function ModalController($scope, $timeout) {
  modalManager.on('open', (options) => {
    console.log(options)
    $scope.options = options
    $scope.isOpen = true
    $timeout(() => {
      $scope.$apply()
    })
  })

  $scope.close = () => {
    $scope.isOpen = false
  }
}
