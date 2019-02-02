import oathForgeApiClient from './oathForgeApiClient.js'
import accountsManager from './accountsManager.js'

export default function AccountTokensController($scope) {
  console.log('AccountTokensController')
  oathForgeApiClient.fetchTokens().then((tokens) => {
    console.log(tokens)
    $scope.tokens = tokens.filter((token) => {
      return accountsManager.getIsControlling(token.data.ownerHexUnprefixed)
    })
    $scope.$apply()
  })
}
