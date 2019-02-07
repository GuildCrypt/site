import networkManager from './networkManager.js'
import accountsManager from './accountsManager.js'
import getIsAddressHexUnprefixed from './getIsAddressHexUnprefixed.js'
import fetchOathForge from './fetchOathForge.js'
import oathForgeApiClient from './oathForgeApiClient.js'
import web3Manager from './web3Manager.js'

function waitForConfirmation(transactionIdHexUnprefixed) {
  return new Promise((resolve, reject) => {
    const onUpdate = (data) => {
      web3Manager.fetchWeb3().then((web3) => {
        if (web3.eth.getTransaction(`0x${transactionIdHexUnprefixed}`, (error, transaction) => {
          if (transaction.blockNumber !== null && transaction.blockNumber <= data.blockNumber) {
            resolve()
          }
        }))
        oathForgeApiClient.removeListener('update', onUpdate)
      })
    }
    oathForgeApiClient.on('update', onUpdate)
  })
}

export default function TransferModalController($scope, $timeout) {
  $scope.stage = 'networkCheck'
  $scope.token = $scope.options.data

  let oathForge

  $scope.checkNetwork = () => {
    $scope.networkCheckError = null
    return fetchOathForge().then((_oathForge) => {
      oathForge = _oathForge
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

  $scope.$watch('receiverHexUnprefixed', (receiverHexUnprefixed) => {
    if (!receiverHexUnprefixed) {
      $scope.isToAddressGood = false
      return
    }
    if (receiverHexUnprefixed.indexOf('0x') === 0) {
      $scope.receiverHexUnprefixed = receiverHexUnprefixed.substr(2)
    }
    $scope.isToAddressGood = getIsAddressHexUnprefixed(receiverHexUnprefixed)

    if ($scope.isToAddressGood) {
      $scope.senderUrl = networkManager.getAddressUrl($scope.token.data.ownerHexUnprefixed)
      $scope.receiverUrl = networkManager.getAddressUrl(receiverHexUnprefixed)
    }
  })

  $scope.submit = () => {
    $scope.stage = 'submitting'
    const senderHexPrefixed = `0x${$scope.token.data.ownerHexUnprefixed}`
    oathForge.transferFrom(
      senderHexPrefixed,
      `0x${$scope.receiverHexUnprefixed}`,
      $scope.token.data.idNumber,
      { from: senderHexPrefixed },
      (submittingError, transactionIdHexPrefixed) => {
        if (submittingError) {
          $scope.submittingError = submittingError
        } else {
          const transactionIdHexUnprefixed = transactionIdHexPrefixed.substr(2)
          $scope.stage = 'confirming'
          $scope.transactionUrl = networkManager.getTransactionUrl(transactionIdHexUnprefixed)
          waitForConfirmation(transactionIdHexUnprefixed).then(() => {
            $scope.stage = 'confirmed'
            $scope.$apply()
          })
        }
        $scope.$apply()
      }
    )
  }
}
