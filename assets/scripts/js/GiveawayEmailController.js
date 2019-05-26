import getIsEmail from './getIsEmail.js'

export default function GiveawayEmailController($scope) {
  $scope.$watch('email', (email) => {
    $scope.isEmailGood = getIsEmail(email)
  })

  $scope.submit = async () => {
    await fetch(`${$scope.options.data.redditApiUrl}/me/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: $scope.options.data.user.cookie
      },
      body: JSON.stringify({
        email: $scope.email,
      })
    })
    $scope.close()
  }
}
