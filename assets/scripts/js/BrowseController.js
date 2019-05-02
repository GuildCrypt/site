import oathforgeApiClient from './oathforgeApiClient.js'

export default function BrowseController($scope) {
  oathforgeApiClient.fetchTokens().then((tokens) => {
    $scope.tokens = tokens
    $scope.$apply()
  })
}
