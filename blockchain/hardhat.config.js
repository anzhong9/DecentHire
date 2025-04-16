require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimizes for 200 function calls in contract lifetime
      },
      viaIR: true, // Enable Intermediate Representation for better optimization
    },
  },
  networks: {
    hardhat: {
      loggingEnabled: true,
      chainId: 31337, // Explicit local chain ID
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // Default Hardhat mnemonic
        accountsBalance: "10000000000000000000000" // 10,000 ETH test balance
      },
      allowUnlimitedContractSize: true, // For complex contracts during development
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337, // Match Hardhat's chain ID
    },
    // Uncomment when ready
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.dev",
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   chainId: 11155111,
    //   gasMultiplier: 1.2,
    // }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000 // 40 seconds for tests
  },
  etherscan: {
    // Enable when ready for verification
    // apiKey: process.env.ETHERSCAN_API_KEY
  }
};