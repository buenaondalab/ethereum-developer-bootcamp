require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    goerli: {
      url: process.env.ALCHEMY_BOOTCAMP_TEST_URL,
      accounts: [process.env.ALCHEMY_BOOTCAMP_TEST_PK],
    }
  }
  
};
