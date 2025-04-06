require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // You can uncomment this when ready to deploy to testnets
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`]
    // }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
