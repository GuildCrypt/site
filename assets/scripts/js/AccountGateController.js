import { default as accountsManager, NoWeb3Error} from './accountsManager.js'

export default function AccountGateController($scope) {
  $scope.isTosConfirmed = false
  $scope.login = async () => {
    if (!$scope.isTosConfirmed) {
      return
    }

    try {
      await accountsManager.login()
    } catch(error) {
      if (error instanceof NoWeb3Error) {
        $scope.isNoWeb3 = true
        $scope.$apply()
      }
    }
  }
}
