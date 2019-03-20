import networkManager from './networkManager.js'
import accountsManager from './accountsManager.js'
import getIsAddressHexUnprefixed from './getIsAddressHexUnprefixed.js'
import fetchOathforge from './fetchOathforge.js'
import riftpactforgeApiClient from './riftpactforgeApiClient.js'
import waitForConfirmation from './waitForConfirmation.js'

export default function TransferRiftpactModalController($scope, $timeout) {
  $scope.stage = 'networkCheck'
  $scope.token = $scope.options.data
  $scope.senderAddressHexUnprefixed = accountsManager.defaultAddressHexUnprefixed

  console.log(accountsManager)

  let riftpact

  $scope.checkNetwork = () => {
    $scope.networkCheckError = null
    return $scope.token.fetchRiftpact().then((_riftpact) => {
      riftpact = _riftpact
      console.log(riftpact)
      return $scope.token.fetchRiftpactBalanceNumber().then((riftpactBalanceNumber) => {
        console.log(riftpactBalanceNumber)
        $scope.riftpactBalanceNumber = $scope.amountNumber = riftpactBalanceNumber
        $scope.stage = 'start'
      })
    }, (networkCheckError) => {
      console.log(networkCheckError)
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

  $scope.$watch('amountNumber', (amountNumber) => {
    if (Number.isNaN(amountNumber)) {
      $scope.isAmountNumberGood = false
      return
    }

    if (!Number.isInteger(amountNumber)) {
      $scope.isAmountNumberGood = false
      return
    }

    if (amountNumber < 1) {
      $scope.isAmountNumberGood = false
      return
    }

    if (amountNumber > $scope.riftpactBalanceNumber) {
      $scope.isAmountNumberGood = false
      return
    }

    $scope.isAmountNumberGood = true
  })

  $scope.submit = () => {
    $scope.stage = 'submitting'
    const senderAddressHexPrefixed = `0x${$scope.senderAddressHexUnprefixed}`
    riftpact.transfer(
      `0x${$scope.receiverAddressHexUnprefixed}`,
      $scope.amountNumber,
      { from: senderAddressHexPrefixed },
      (submittingError, transactionIdHexPrefixed) => {
        if (submittingError) {
          $scope.submittingError = submittingError
        } else {
          const transactionIdHexUnprefixed = transactionIdHexPrefixed.substr(2)
          $scope.stage = 'confirming'
          $scope.transactionUrl = networkManager.getTransactionUrl(transactionIdHexUnprefixed)
          waitForConfirmation(riftpactforgeApiClient, transactionIdHexUnprefixed).then(() => {
            $scope.stage = 'confirmed'
            $scope.$apply()
          })
        }
        $scope.$apply()
      }
    )
  }
}
