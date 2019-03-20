import networkManager from './networkManager.js'
import accountsManager from './accountsManager.js'
import getIsAddressHexUnprefixed from './getIsAddressHexUnprefixed.js'
import fetchOathforge from './fetchOathforge.js'
import oathforgeApiClient from './oathforgeApiClient.js'
import waitForConfirmation from './waitForConfirmation.js'

export default function TransferOathModalController($scope, $timeout) {
  $scope.stage = 'networkCheck'
  $scope.token = $scope.options.data
  $scope.senderAddressHexUnprefixed = accountsManager.defaultAddressHexUnprefixed

  let oathforge

  $scope.checkNetwork = () => {
    $scope.networkCheckError = null
    return fetchOathforge().then((_oathforge) => {
      oathforge = _oathforge
      $scope.stage = 'start'
    }, (networkCheckError) => {
      $scope.networkCheckError = networkCheckError
    }).finally(() => {
      $scope.$apply()
    })
  }

  $scope.checkNetwork()

  $scope.$watch('stage', (stage) => {
    $scope.submittingError = null
    if (stage === 'networkCheck') {
      $scope.progress = 1
    }
    if (stage === 'start') {
      $scope.progress = 10
    }
    if (stage === 'confirmation') {
      $scope.progress = 30
    }
    if (stage === 'submitting') {
      $scope.progress = 50
    }
    if (stage === 'confirming') {
      $scope.progress = 75
    }
    if (stage === 'confirmed') {
      $scope.progress = 100
    }
  })

  $scope.$watch('receiverAddressHexUnprefixed', (receiverAddressHexUnprefixed) => {
    if (!receiverAddressHexUnprefixed) {
      $scope.isReceiverAddressGood = false
      return
    }
    if (receiverAddressHexUnprefixed.indexOf('0x') === 0) {
      $scope.receiverAddressHexUnprefixed = receiverAddressHexUnprefixed.substr(2)
    }
    $scope.isReceiverAddressGood = getIsAddressHexUnprefixed(receiverAddressHexUnprefixed)

    if ($scope.isReceiverAddressGood) {
      $scope.senderUrl = networkManager.getAddressUrl($scope.senderAddressHexUnprefixed)
      $scope.receiverUrl = networkManager.getAddressUrl(receiverAddressHexUnprefixed)
    }
  })

  $scope.submit = () => {
    $scope.stage = 'submitting'
    const senderAddressHexPrefixed = `0x${$scope.token.data.ownerHexUnprefixed}`
    console.log(senderAddressHexPrefixed)
    oathforge.transferFrom(
      senderAddressHexPrefixed,
      `0x${$scope.receiverAddressHexUnprefixed}`,
      $scope.token.data.idNumber,
      { from: senderAddressHexPrefixed },
      (submittingError, transactionIdHexPrefixed) => {
        if (submittingError) {
          $scope.submittingError = submittingError
        } else {
          const transactionIdHexUnprefixed = transactionIdHexPrefixed.substr(2)
          $scope.stage = 'confirming'
          $scope.transactionUrl = networkManager.getTransactionUrl(transactionIdHexUnprefixed)
          waitForConfirmation(oathforgeApiClient, transactionIdHexUnprefixed).then(() => {
            $scope.stage = 'confirmed'
            $scope.$apply()
          })
        }
        $scope.$apply()
      }
    )
  }
}
