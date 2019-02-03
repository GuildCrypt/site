import oathForgeApiClient from './oathForgeApiClient.js'
import accountsManager from './accountsManager.js'

export default function AccountTokensController($scope) {
  function updateTokens() {
    return oathForgeApiClient.fetchTokens().then((tokens) => {
      $scope.tokens = tokens.filter((token) => {
        return accountsManager.getIsControlling(token.data.ownerHexUnprefixed)
      })
      $scope.$apply()
    })
  }
  updateTokens()
  oathForgeApiClient.on('update', updateTokens)
}
