import networkManager from './networkManager.js'

import AccountController from './AccountController.js'
import AccountGateController from './AccountGateController.js'
import AccountTokensController from './AccountTokensController.js'
import BrowseController from './BrowseController.js'
import TransferOathModalController from './TransferOathModalController.js'
import TransferRiftpactBalanceModalController from './TransferRiftpactBalanceModalController.js'
import WatchEmailModalController from './WatchEmailModalController.js'
import RedeemModalController from './RedeemModalController.js'
import DexInABoxController from './DexInABoxController.js'
import TradeController from './TradeController.js'
import CryptoloanController from './CryptoloanController.js'
import GiveawayController from './GiveawayController.js'

import modalDirective from './modalDirective.js'
import tokenDirective from './tokenDirective.js'
import tokensDirective from './tokensDirective.js'
import tokenMiniDirective from './tokenMiniDirective.js'

const app = angular.module('app', [])

app.controller('AccountController', AccountController)
app.controller('AccountGateController', AccountGateController)
app.controller('AccountTokensController', AccountTokensController)
app.controller('BrowseController', BrowseController)
app.controller('TransferOathModalController', TransferOathModalController)
app.controller('TransferRiftpactBalanceModalController', TransferRiftpactBalanceModalController)
app.controller('WatchEmailModalController', WatchEmailModalController)
app.controller('RedeemModalController', RedeemModalController)
app.controller('DexInABoxController', DexInABoxController)
app.controller('TradeController', TradeController)
app.controller('CryptoloanController', CryptoloanController)
app.controller('GiveawayController', GiveawayController)

app.directive('tokens', tokensDirective)
app.directive('token', tokenDirective)
app.directive('modal', modalDirective)
app.directive('tokenMini', tokenMiniDirective)

app.directive('images', function () {
  return {
    scope: {
      images: '=',
    },
    templateUrl: `/templates/images.html`,
    link: function ($scope) {
      $scope.index = 0

      if (!$scope.images) {
        return
      }
      $scope.images.forEach((image) => {
        const imageLoader = new Image
        imageLoader.src = image.thumb
      })
    }
  }
})

app.directive('networkToggle', function () {
  return {
    templateUrl: `/templates/network-toggle.html`,
    link: function ($scope) {
      $scope.network = networkManager.network
      $scope.toggleNetwork = () => {
        if(!confirm('Toggle Network?')) {
          return
        }
        networkManager.toggleNetwork()
      }
    }
  }
})

app.filter('numeric', function() {
  return function(number) {
      if (number === undefined) {
        return ''
      }
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
})
