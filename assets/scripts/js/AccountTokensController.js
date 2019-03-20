import oathforgeApiClient from './oathforgeApiClient.js'
import accountsManager from './accountsManager.js'

export default function AccountTokensController($scope) {
  function updateTokens() {
    return oathforgeApiClient.fetchTokens().then((tokens) => {
      $scope.tokens = tokens.filter((token) => {
        return accountsManager.getIsControlling(token.data.ownerHexUnprefixed)
      })
      $scope.$apply()
    })
  }
  updateTokens()
  oathforgeApiClient.on('update', updateTokens)
}
