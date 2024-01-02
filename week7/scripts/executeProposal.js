const { ethers } = require("hardhat");
const { toUtf8Bytes, keccak256, parseEther } = ethers.utils;

const governorAddr = "0xd5135dFE4B35c21c5C5bFe48e4b18D719DB98699";

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("MyGovernor", governorAddr);
    const tokenAddr = await governor.token();
    const token = await ethers.getContractAt("MyToken", tokenAddr);

    const tx = await governor.execute(
        [tokenAddr],
        [0],
        [token.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
        keccak256(toUtf8Bytes("Give the owner more tokens!"))
      );
    
    await tx.wait();
    console.log('Proposal executed!');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});