import oathforgeApiClient from './oathforgeApiClient.js'
import accountsManager from './accountsManager.js'

async function filter(arr, callback) {
  const fail = Symbol()
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail)
}


export default function AccountTokensController($scope) {
  function updateTokens() {
    return oathforgeApiClient.fetchTokens().then(async (tokens) => {
      $scope.tokens = await filter(tokens, async (token) => {
        if (token.getIsUserOathOwner()) {
          return true
        }
        if (!await token.fetchRiftpactData()) {
          return false
        }

        if (await token.fetchRiftpactBalanceNumber() === 0) {
          return false
        }

        return true
      })
      $scope.$apply()
    })
  }
  updateTokens()
  oathforgeApiClient.on('update', updateTokens)
}
