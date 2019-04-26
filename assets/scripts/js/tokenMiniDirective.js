import modalManager from './modalManager.js'
import emailManager from './emailManager.js'
import watchManager from './watchManager.js'
import accountsManager from './accountsManager.js'

export default function tokenMiniDirective () {
  return {
    scope: {
      token: '=tokenMini'
    },
    templateUrl: `/templates/token-mini.html`,
    link: ($scope) => {

      const token = $scope.token
      console.log(token.riftpactData)

      token.fetchRiftpactData().then((riftpactData) => {
        console.log(token.riftpactData)
        $scope.$apply()
        if (riftpactData && accountsManager.isLoggedIn) {
          token.fetchRiftpactBalanceNumber().then((riftpactBalanceNumber) => {
            $scope.riftpactBalanceNumber = riftpactBalanceNumber
            $scope.$apply()
          })
        }
      })
    }
  }
}
