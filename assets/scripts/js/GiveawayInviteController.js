export default function GiveawayInviteController($scope, $timeout) {

  const tweet = `Trying to win some free Magic Cards with @GuildCrypt Scrambleverse. Help me out? ${$scope.options.data.inviteUrl}`
  $scope.tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`

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

    $timeout(() => {
      $scope.isCopied = false
    }, 1000)
  }

}
