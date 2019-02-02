import accountsManager from './accountsManager.js'

export default function AccountController($scope) {
  $scope.isLoggedIn = accountsManager.isLoggedIn
  accountsManager.on('logged-in', () => {
    $scope.isLoggedIn = true
    $scope.$apply()
  })
}
