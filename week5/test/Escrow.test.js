const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('Escrow', function () {

  const deposit = ethers.utils.parseEther('1');

  async function deployContract() {
    const factory = await ethers.getContractFactory('EscrowFactory');
    const escrowFactory = await factory.deploy();
    await escrowFactory.deployed();
    const arbiter = ethers.provider.getSigner(1);
    const beneficiary = ethers.provider.getSigner(2);
    const escrowTx = await escrowFactory.publish(await arbiter.getAddress(), await beneficiary.getAddress(), {value: deposit});
    const escrowReceipt = await escrowTx.wait();
    const contractAddress = `0x${escrowReceipt.logs[0].topics[1].slice(-40)}`;
    return {contractAddress, arbiter, beneficiary};
  }

  let contract;
  let depositor;
  let beneficiary;
  let arbiter;

  beforeEach(async () => {
    fixture = await loadFixture(deployContract);
    contractAddress = fixture.contractAddress;
    contract = await ethers.getContractAt('Escrow', contractAddress);
    arbiter = fixture.arbiter;
    beneficiary = fixture.beneficiary;
    depositor = ethers.provider.getSigner(0);
  });

  it('escrow contract has been deployed', () => {
    expect(contractAddress).not.to.be.undefined;
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contractAddress);
    expect(balance).to.eq(deposit);
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });
  });
});
