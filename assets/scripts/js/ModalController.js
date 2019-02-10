import modalManager from './modalManager.js'

export default function ModalController($scope, $timeout) {
  modalManager.on('open', (options) => {
    console.log('open')
    $scope.options = options
    $scope.isOpen = true
    $timeout(() => {
      $scope.$apply()
    })
  })

  modalManager.on('request-close', () => {
    $scope.close()
  })

  $scope.close = (data) => {
    $scope.isOpen = false
    modalManager.closed(data)
  }
}
