import accountsManager from './accountsManager.js'
import networkManager from './networkManager.js'
import oathforgeApiClient from './oathforgeApiClient.js'

export default function TradeController($scope) {
  const params = document.location.hash.substr(1).split('/')
  const idNumber = parseInt(params[1])
  console.log(params)

  const zocrAddressHexUnprefixed = networkManager.getZocrAddressHexUnprefixed()
  const exchangeAddressHexUnprefixed = networkManager.getExchangeAddressHexUnprefixed()
  const erc20ProxyAddressHexUnprefixed = networkManager.getErc20ProxyAddressHexUnprefixed()
  const quoteAssetAddressHexUnprefixed = networkManager.getDaiAddressHexUnprefixed()

  oathforgeApiClient.fetchToken(idNumber).then(async (token) => {
    const riftpactData = await token.fetchRiftpactData()
    const zocrscope = new Zocrscope(
      web3.currentProvider,
      zocrAddressHexUnprefixed,
      exchangeAddressHexUnprefixed,
      erc20ProxyAddressHexUnprefixed,
      `${token.data.uriData.name} Oath Pieces`,
      'DAI',
      riftpactData.addressHexUnprefixed,
      quoteAssetAddressHexUnprefixed
    )
    zocrscope.appendTo$(document.getElementById('zocrscope'))

    $scope.token = token
    $scope.$apply()
  })

}
