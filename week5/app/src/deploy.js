import { ethers,  } from 'ethers';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';
import {resolveFactoryAddress} from './utils';

export default async function deploy(signer, arbiter, beneficiary, value) {
  const escrowFactory = new ethers.Contract(resolveFactoryAddress(await signer.getChainId()), EscrowFactory.abi, signer);
  const publishTx = await escrowFactory.publish(arbiter, beneficiary, {value});
  const publishReceipt = await publishTx.wait();
  const contractAddress = `0x${publishReceipt.logs[0].topics[1].slice(-40)}`;
  return new ethers.Contract(contractAddress, Escrow.abi);
}
