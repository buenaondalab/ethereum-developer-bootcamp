import {ethers} from 'ethers';

export function resolveFactoryAddress(chainId) {
    switch(chainId) {
      case 5: return process.env.REACT_APP_CONTRACT_FACTORY;
      case 31337: 
      default: return process.env.REACT_APP_LOCAL_FACTORY;
    }
  }

  /**
   * 
   * @param {ethers.Contract} contract 
   * @returns approved value in Ether
   */
export async function getApprovedValue(contract) {
  return ethers.utils.formatEther(
    (await contract.queryFilter(contract.filters.Approved()))[0].topics[1]
  )
}