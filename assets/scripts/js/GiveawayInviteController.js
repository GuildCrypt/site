export default function GiveawayInviteController($scope, $timeout, $element) {

  const tweet = `Trying to win some free Magic Cards with @GuildCrypt Scrambleverse. Help me out? ${$scope.options.data.inviteUrl}`
  $scope.tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`

  $scope.copy = () => {
    const $temp = document.createElement('textarea');
    $element[0].appendChild($temp);
    $temp.value = $scope.options.data.inviteUrl
    $temp.select()
    const msg = document.execCommand('copy');
    $element[0].removeChild($temp)
    $scope.isCopied = true

    $timeout(() => {
      $scope.isCopied = false
    }, 1000)
  }

}
