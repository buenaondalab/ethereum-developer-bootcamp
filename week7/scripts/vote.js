const { ethers } = require("hardhat");

const governorAddr = "0xd5135dFE4B35c21c5C5bFe48e4b18D719DB98699";
//0 reject, 1 approve, 2 abstained
const vote = 1;
const proposalId = 43132950710684044989607366132486904172462116561094975844799800186432687871891n; //TODO change

async function main() {
    const governor = await ethers.getContractAt("MyGovernor", governorAddr);
    const tx = await governor.castVote(proposalId, vote);
    const receipt = await tx.wait();
    const voteCastEvent = receipt.events.find(x => x.event === 'VoteCast');
    console.log(
        `${voteCastEvent.args.voter} has just voted on proposal ${proposalId} with weight: ${voteCastEvent.args.weight}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});