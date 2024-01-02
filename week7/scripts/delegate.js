const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
    const tokenAddr = "0x27bE4B4Ac4a05b9141d454470c3a7868a7B884c6";
    const token = await ethers.getContractAt("MyToken", tokenAddr);
    const delegateTx = await token.delegate(owner.address);
    await delegateTx.wait();
    console.log("Voting power delegation done");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});