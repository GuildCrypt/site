export class CouldNotEnableEthereumError extends Error {}
export class NoEthereumWalletDetectedError extends Error {}

export function getWeb3() {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
        const web3 = new Web3(ethereum)
        ethereum.enable().then(() => {
          resolve(web3)
        }, (error) => {
          reject(new CouldNotEnableEthereumError(error.message))
        })
      } else if (window.web3) {
        resolve(window.web3)
      }
      else {
        reject(new NoEthereumWalletDetectedError())
      }
  })
}
