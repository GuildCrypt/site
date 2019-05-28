import blackLoti from './datasets/blackLoti.js'

export default function BlackLotusPriceController($scope) {

  let blackLotusUsdPriceNumberMin = null
  let blackLotusUsdPriceNumberMax = null
  let blackLotusGradingNumberMin = null
  let blackLotusGradingNumberMax = null

  $scope.blackLoti = blackLoti
  $scope.prints = 'abcu'
  $scope.graders = 'bp'

  $scope.printsKey = {
    'a': {
      name: 'Alpha',
      color: 'red'
    },
    'b': {
      name: 'Beta',
      color: 'blue'
    },
    'u': {
      name: 'Unlimited',
      color: 'green'
    },
    'c': {
      name: 'Collectors',
      color: 'orange'
    }
  }

  $scope.gradersKey = {
    'b': {
      name: 'BGS',
      shape: 'circle'
    },
    'p': {
      name: 'PSA',
      shape: 'square'
    }
  }


  blackLoti.forEach((blackLotus) => {
    blackLotus.ebay.usdPriceNumber = parseFloat(blackLotus.ebay.usdPrice)
    blackLotus.gradeNumber = parseFloat(blackLotus.grade)


    if (
      blackLotusUsdPriceNumberMin === null
      || blackLotus.ebay.usdPriceNumber < blackLotusUsdPriceNumberMin
    ) {
      blackLotusUsdPriceNumberMin = blackLotus.ebay.usdPriceNumber
    }

    if (
      blackLotusUsdPriceNumberMax === null
      || blackLotus.ebay.usdPriceNumber > blackLotusUsdPriceNumberMax
    ) {
      blackLotusUsdPriceNumberMax = blackLotus.ebay.usdPriceNumber
    }

    if (
      blackLotusGradingNumberMin === null
      || blackLotus.gradeNumber < blackLotusGradingNumberMin
    ) {
      blackLotusGradingNumberMin = blackLotus.gradeNumber
    }

    if (
      blackLotusGradingNumberMax === null
      || blackLotus.gradeNumber > blackLotusGradingNumberMax
    ) {
      blackLotusGradingNumberMax = blackLotus.gradeNumber
    }
  })

  blackLoti.forEach((blackLotus) => {
    blackLotus.x =
      (blackLotus.gradeNumber - blackLotusGradingNumberMin)
      / (blackLotusGradingNumberMax - blackLotusGradingNumberMin)
    blackLotus.y =
      (blackLotus.ebay.usdPriceNumber - blackLotusUsdPriceNumberMin)
      / (blackLotusUsdPriceNumberMax - blackLotusUsdPriceNumberMin)
  })

  $scope.select = function select(blackLotus) {
    if ($scope.blackLotus) {
      $scope.blackLotus.isSelected = false
    }
    blackLotus.isSelected = true
    $scope.blackLotus = blackLotus
  }

  $scope.select(blackLoti[0])
}
