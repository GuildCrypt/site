import networkManager from './networkManager.js'
import accountsManager from './accountsManager.js'
import getIsAddressHexUnprefixed from './getIsAddressHexUnprefixed.js'
import fetchOathForge from './fetchOathForge.js'
import oathforgeApiClient from './oathforgeApiClient.js'
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
        oathforgeApiClient.removeListener('update', onUpdate)
      })
    }
    oathforgeApiClient.on('update', onUpdate)
  })
}

export default function FractureModalController($scope, $timeout) {
  $scope.stage = 'networkCheck'
  $scope.token = $scope.options.data

  let oathforge

  $scope.lockupDaysString = '90'

  $scope.checkNetwork = () => {
    $scope.networkCheckError = null
    return fetchOathForge().then((_oathforge) => {
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


  $scope.submit = () => {
    $scope.stage = 'submitting'
    const senderHexPrefixed = `0x${$scope.token.data.ownerHexUnprefixed}`
    oathforge.transferFrom(
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
