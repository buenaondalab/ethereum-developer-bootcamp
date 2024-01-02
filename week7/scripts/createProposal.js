const { ethers } = require("hardhat");

const governorAddr = "0xd5135dFE4B35c21c5C5bFe48e4b18D719DB98699";

async function main() {
    const governor = await ethers.getContractAt("MyGovernor", governorAddr);
    const tokenAddr = await governor.token();
    const token = await ethers.getContractAt("MyToken", tokenAddr);
    const [owner] = await ethers.getSigners();

    const tx = await governor.propose(
        [tokenAddr],
        [0],
        [token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")])],
        "Give the owner more tokens!"
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(x => x.event === 'ProposalCreated');
      const { proposalId } = event.args;
      console.log(`proposal id: ${proposalId}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});