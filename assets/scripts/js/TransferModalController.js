import accountsManager from './accountsManager.js'
import getIsAddressHexUnprefixed from './getIsAddressHexUnprefixed.js'

export default function TransferModalController($scope, $timeout) {
  $scope.stage = 'start'
  $scope.token = $scope.options.data

  $scope.$watch('stage', (stage) => {
    if (stage === 'start') {
      $scope.progress = 1
    }
    if (stage === 'confirmation') {
      $scope.progress = 30
    }
  })

  $scope.$watch('receiverHexUnprefixed', (receiverHexUnprefixed) => {
    if (!receiverHexUnprefixed) {
      $scope.isToAddressGood = false
      return
    }
    if (receiverHexUnprefixed.indexOf('0x') === 0) {
      $scope.receiverHexUnprefixed = receiverHexUnprefixed.substr(2)
    }
    $scope.isToAddressGood = getIsAddressHexUnprefixed(receiverHexUnprefixed)
  })
}
