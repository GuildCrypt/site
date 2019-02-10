import emailManager from './emailManager.js'
import getIsEmail from './getIsEmail.js'
import modalManager from './modalManager.js'

export default function WatchEmailModalController($scope, $timeout) {
  $scope.token = $scope.options.data

  $scope.$watch('email', (email) => {
    $scope.isEmailGood = getIsEmail(email)
  })

  $scope.submit = () => {
    emailManager.set($scope.email)
    modalManager.close()
  }
}
