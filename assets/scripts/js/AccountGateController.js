import accountsManager from './accountsManager.js'

export default function AccountGateController($scope) {
  $scope.isTosConfirmed = false
  $scope.login = () => {
    if (!$scope.isTosConfirmed) {
      return
    }
    return accountsManager.login()
  }
}
