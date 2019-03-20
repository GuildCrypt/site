import web3Manager from './web3Manager.js'

export default function waitForConfirmation(apiClient, transactionIdHexUnprefixed) {
  return new Promise((resolve, reject) => {
    const onUpdate = (data) => {
      web3Manager.fetchWeb3().then((web3) => {
        if (web3.eth.getTransaction(`0x${transactionIdHexUnprefixed}`, (error, transaction) => {
          if (transaction.blockNumber !== null && transaction.blockNumber <= data.blockNumber) {
            resolve()
          }
        }))
        apiClient.removeListener('update', onUpdate)
      })
    }
    apiClient.on('update', onUpdate)
  })
}
