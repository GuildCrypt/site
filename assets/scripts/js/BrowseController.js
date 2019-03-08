import oathForgeApiClient from './oathForgeApiClient.js'

export default function BrowseController($scope) {
  oathForgeApiClient.fetchTokens().then((tokens) => {
    $scope.tokens = tokens
    $scope.$apply()
  })
}
