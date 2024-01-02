require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_BOOTCAMP_TEST_URL,
      accounts: [process.env.ALCHEMY_BOOTCAMP_TEST_PK],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  }
};
