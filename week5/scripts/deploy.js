const contractName = "EscrowFactory";

async function main() {
    const factory = await hre.ethers.getContractFactory(contractName);
    // if you need to add constructor arguments for the particular game, add them here:
    const escrowFactory = await factory.deploy();
    await escrowFactory.deployed();
    console.log(`${contractName} deployed to address: ${escrowFactory.address}`);
  }
  
  main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });