import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import escrowMeta from './artifacts/contracts/Escrow.sol/Escrow.json';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory';
import {getApprovedValue, resolveFactoryAddress} from './utils';
import NewContract from './NewContract'

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function getExistingContracts() {
    const existings = await new Contract(resolveFactoryAddress(provider.network?.chainId), EscrowFactory.abi, signer).getEscrows();
    const contracts = await Promise.all(existings.map(async address => {
      const contract = new Contract(address, escrowMeta.abi, provider);
      const isApproved = await contract.isApproved();
      const value = isApproved ? await getApprovedValue(contract) : ethers.utils.formatEther(await provider.getBalance(contract.address));
      return {
        address: contract.address,
        arbiter: await contract.arbiter(),
        beneficiary: await contract.beneficiary(),
        isApproved,
        value,
        handleApprove: async () => {
          contract.on('Approved', () => {
            document.getElementById(contract.address).className =
              'complete';
            document.getElementById(contract.address).innerText =
              "✓ It's been approved!";
          });
  
          await approve(contract, signer);
        },
      };  
    }));
    const toAdd = contracts.filter(contract => !escrows.map(e => e.address.toLowerCase()).includes(contract.address.toLowerCase()));
    toAdd.length > 0 && setEscrows([...escrows, ...contracts]);
  }

  useEffect(() => {
    getExistingContracts();
  })

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('wei').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: ethers.utils.formatEther(value),
      isApproved: false,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }
  const factoryAddress = resolveFactoryAddress(provider.network?.chainId);
  function deployAction(e) {
    e.preventDefault();
    newContract();
  }

  return (
    <div>
      <div className="header">
        <h1>Decentralized Escrow Application</h1>
      </div>
      <div className="network">
        <h3>Network id: {provider.network?.chainId}</h3></div>
      <div className="user"><h4>User: {account}</h4></div>
      <div className="main">
        <NewContract factory={factoryAddress} deployAction={deployAction} />

        <div className="existing-contracts">
          <h1> Existing Contracts </h1>

          <div id="container">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
