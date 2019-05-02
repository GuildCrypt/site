import accountsManager from './accountsManager.js'
import networkManager from './networkManager.js'
import oathforgeApiClient from './oathforgeApiClient.js'
import fetchZocrscope from './fetchZocrscope.js'
import web3Manager from './web3Manager.js'

export default function TradeController($scope, $interval) {
  const params = document.location.hash.substr(1).split('/')
  const idNumber = parseInt(params[1])
  $scope.isZocrscopeLoaded = false

  $scope.isZocrscopeLoaded
  $scope.progress = 1

  const interval = $interval(() => {
    $scope.progress = 100 - Math.round((100 - $scope.progress) / 2)
  }, 100)


  oathforgeApiClient.fetchToken(idNumber).then(async (token) => {
    const riftpactData = await token.fetchRiftpactData()
    $scope.token = token
    $scope.$apply()

    const web3 = await web3Manager.fetchWeb3()

    setTimeout(async () => { // don't block ui
      const Zocrscope = await fetchZocrscope()
      $interval.cancel(interval)
      $scope.progress = 100
      setTimeout(() => {
        const zocrscope = new Zocrscope(
          web3.currentProvider,
          zocrAddressHexUnprefixed,
          exchangeAddressHexUnprefixed,
          erc20ProxyAddressHexUnprefixed,
          'Piece',
          'DAI',
          'Pieces',
          'DAI',
          riftpactData.addressHexUnprefixed,
          quoteAssetAddressHexUnprefixed,
          0,
          18
        )
        $scope.isZocrscopeLoaded = true
        $scope.$apply()
        zocrscope.appendTo$(document.getElementById('zocrscope'))
      }, 1000)
    }, 500)
  })

  const zocrAddressHexUnprefixed = networkManager.getZocrAddressHexUnprefixed()
  const exchangeAddressHexUnprefixed = networkManager.getExchangeAddressHexUnprefixed()
  const erc20ProxyAddressHexUnprefixed = networkManager.getErc20ProxyAddressHexUnprefixed()
  const quoteAssetAddressHexUnprefixed = networkManager.getDaiAddressHexUnprefixed()

  setTimeout(() => {
    const Zocrscope = fetchZocrscope()

  })

}
