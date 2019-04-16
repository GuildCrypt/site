import modalManager from './modalManager.js'
import emailManager from './emailManager.js'
import watchManager from './watchManager.js'
import accountsManager from './accountsManager.js'
import networkManager from './networkManager.js'

export default function tokenDirective () {
  return {
    scope: {
      token: '='
    },
    templateUrl: `/templates/token.html`,
    link: ($scope) => {

      const token = $scope.token

      $scope.openTransferOathModal = () => {
        modalManager.open({
          modalSize: 'lg',
          templateUrl: '/templates/modals/transfer-oath.html',
          data: token
        })
      }

      $scope.openTransferRiftpactBalanceModal = () => {
        modalManager.open({
          modalSize: 'lg',
          templateUrl: '/templates/modals/transfer-riftpact-balance.html',
          data: token
        })
      }

      $scope.toggleIsWatching = () => {
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

      $scope.redeem = () => {
        modalManager.open({
          modalSize: 'lg',
          templateUrl: '/templates/modals/redeem.html',
          data: token
        })
      }

      if (accountsManager.isLoggedIn) {
        token.getIsUserOathOwner()
      }

      token.fetchRiftpactData().then((riftpactData) => {
        $scope.$apply()
        if (riftpactData && accountsManager.isLoggedIn) {
          token.fetchRiftpactBalanceNumber().then((riftpactBalanceNumber) => {
            $scope.riftpactBalanceNumber = riftpactBalanceNumber
            $scope.$apply()
          })
        }
      })

      $scope.openTradeWindow = async () => {
        const baseAssetLabel = `${token.data.uriData.name} Oath Pieces`
        const quoteAssetLabel = 'DAI'

        const riftpactData = await token.fetchRiftpactData()
        const baseAssetAddressHexUnprefixed = riftpactData.addressHexUnprefixed
        const quoteAssetAddressHexUnprefixed = networkManager.getDaiAddressHexUnprefixed()

        const left = (screen.availWidth / 2) - 400
        const top = (screen.availHeight / 2) - 400

        const url = `/trade?${(new Date).getTime()}#${encodeURI(baseAssetLabel)}/${encodeURI(quoteAssetLabel)}/${baseAssetAddressHexUnprefixed}/${quoteAssetAddressHexUnprefixed}`
        window.open(url, 'trade', `height=800,width=800,toolbar=no,status=no,location=no,menubar=no,top=${top},left=${left}`)
      }

    }
  }
}
