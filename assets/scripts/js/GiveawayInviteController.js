export default function GiveawayInviteController($scope) {
  $scope.copy = () => {
    const $temp = document.createElement('textarea');
    document.body.appendChild($temp);
    $temp.value = $scope.options.data.inviteUrl
    $temp.select()
    console.log($temp)
    const msg = document.execCommand('copy');
    console.log(msg)
    document.body.removeChild($temp)
    $scope.isCopied = true
  }

}
