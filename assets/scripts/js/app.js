import networkManager from './networkManager.js'

import AccountController from './AccountController.js'
import AccountGateController from './AccountGateController.js'
import AccountTokensController from './AccountTokensController.js'
import MarketplaceController from './MarketplaceController.js'
import TransferModalController from './TransferModalController.js'

import modalDirective from './modalDirective.js'
import tokensDirective from './tokensDirective.js'

const app = angular.module('app', [])

app.controller('AccountController', AccountController)
app.controller('AccountGateController', AccountGateController)
app.controller('AccountTokensController', AccountTokensController)
app.controller('MarketplaceController', MarketplaceController)
app.controller('TransferModalController', TransferModalController)

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
  console.log('x')
  return {
    templateUrl: `/templates/network-toggle.html`,
    link: function ($scope) {
      console.log(networkManager)
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
