import networkManager from './networkManager.js'

import AccountController from './AccountController.js'
import AccountGateController from './AccountGateController.js'
import AccountTokensController from './AccountTokensController.js'
import BrowseController from './BrowseController.js'
import TransferModalController from './TransferModalController.js'
import WatchEmailModalController from './WatchEmailModalController.js'
import RedeemModalController from './RedeemModalController.js'
import DexInABoxController from './DexInABoxController.js'

import modalDirective from './modalDirective.js'
import tokensDirective from './tokensDirective.js'

const app = angular.module('app', [])

app.controller('AccountController', AccountController)
app.controller('AccountGateController', AccountGateController)
app.controller('AccountTokensController', AccountTokensController)
app.controller('BrowseController', BrowseController)
app.controller('TransferModalController', TransferModalController)
app.controller('WatchEmailModalController', WatchEmailModalController)
app.controller('RedeemModalController', RedeemModalController)
app.controller('DexInABoxController', DexInABoxController)

app.directive('tokens', tokensDirective)
app.directive('modal', modalDirective)

app.directive('images', function () {
  return {
    scope: {
      images: '=',
    },
    templateUrl: `/templates/images.html`,
    link: function ($scope) {
      $scope.index = 0
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
