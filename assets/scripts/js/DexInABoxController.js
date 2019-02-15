import emailServerUrl from './emailServerUrl.js'

export default function DexInABoxController($scope) {
  $scope.submit = ($event) => {
    if ($scope.isSubmitting) {
      return
    }
    $scope.isSubmitting = true
    $event.preventDefault()
    fetch(`${emailServerUrl}/v0/subscribe/dex-in-a-box`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email
      })
    }).then((response) => {
      if (response.status !== 200) {
        alert('Something went wrong. Make sure to fill out all the inputs')
      } else {
        alert('Thanks! We\'ll be in touch shortly')
      }
      $scope.isSubmitting = false
      $scope.$apply()
    })
    return false
  }
}
