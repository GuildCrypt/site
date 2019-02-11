import modalManager from './modalManager.js'
import emailManager from './emailManager.js'
import watchManager from './watchManager.js'

export default function tokensDirective ($timeout) {
  return {
    scope: {
      tokens: '='
    },
    templateUrl: `/templates/tokens.html`,
    link: ($scope) => {
      $scope.openTransferModal = (token) => {
        modalManager.open({
          modalSize: 'lg',
          templateUrl: '/templates/modals/transfer.html',
          data: token
        })
      }

      $scope.toggleIsWatching = (token) => {
        if(!token.isWatching && !emailManager.get()) {
          modalManager.open({
            modalSize: 'md',
            templateUrl: '/templates/modals/watch-email.html',
            data: token
          }).then(() => {
            if (emailManager.get()) {
              token.toggleIsWatching()
              $scope.$apply()
            }
          })
        } else {
          token.toggleIsWatching()
        }
      }

      $scope.redeem = (token) => {
        modalManager.open({
          modalSize: 'lg',
          templateUrl: '/templates/modals/redeem.html',
          data: token
        })
      }
    }
  }
}
