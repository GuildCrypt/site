import oathForgeApiClient from './oathForgeApiClient.js'

export default function MarketplaceController($scope) {
  oathForgeApiClient.fetchTokens().then((tokens) => {
    console.log(tokens)
    $scope.tokens = tokens
    $scope.$apply()
  })
}
