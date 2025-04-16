// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy UserProfile (unchanged)
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();

  // Deploy SimpleJobContract
  const SimpleJobContract = await hre.ethers.getContractFactory("SimpleJobContract");
  const simpleJobContract = await SimpleJobContract.deploy();
  await simpleJobContract.waitForDeployment();
  const simpleJobAddress = await simpleJobContract.getAddress();

  // Deploy SimpleMilestoneContract 
  const SimpleMilestoneContract = await hre.ethers.getContractFactory("SimpleMilestoneContract");
  const simpleMilestoneContract = await SimpleMilestoneContract.deploy();
  await simpleMilestoneContract.waitForDeployment();
  const simpleMilestoneAddress = await simpleMilestoneContract.getAddress();

  // Prepare addresses for frontend
  const contractAddresses = {
    userProfile: userProfileAddress,
    jobContract: simpleJobAddress,
    milestoneContract: simpleMilestoneAddress
  };

  // Save to client/src/contracts
  const contractsDir = path.join(__dirname, "../../client/src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save addresses
  fs.writeFileSync(
    path.join(contractsDir, "contract-addresses.json"),
    JSON.stringify(contractAddresses, null, 2)
  );

  // Save ABIs
  const saveAbi = (contractName) => {
    const artifact = require(`../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    fs.writeFileSync(
      path.join(contractsDir, `${contractName}-abi.json`),
      JSON.stringify(artifact.abi, null, 2)
    );
  };

  saveAbi("UserProfile");
  saveAbi("SimpleJobContract");
  saveAbi("SimpleMilestoneContract");

  console.log("Contracts deployed:");
  console.log("- UserProfile:", userProfileAddress);
  console.log("- SimpleJobContract:", simpleJobAddress);
  console.log("- SimpleMilestoneContract:", simpleMilestoneAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });