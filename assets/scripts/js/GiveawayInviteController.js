import clipboardCopy from './clipboardCopy.js'

export default function GiveawayInviteController($scope, $timeout, $element) {

  const tweet = `Trying to win some free Magic Cards with @GuildCrypt Scrambleverse. Help me out? ${$scope.options.data.inviteUrl}`
  $scope.tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`

  $scope.copy = () => {
    clipboardCopy($scope.options.data.inviteUrl)
    $scope.isCopied = true

    $timeout(() => {
      $scope.isCopied = false
    }, 1000)
  }

}
