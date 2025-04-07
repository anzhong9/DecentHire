const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying contracts...");

  // Deploy DecentHire
  const DecentHire = await hre.ethers.getContractFactory("DecentHire");
  const decentHire = await DecentHire.deploy();
  await decentHire.waitForDeployment();
  const decentHireAddress = await decentHire.getAddress();
  console.log("✅ DecentHire deployed to:", decentHireAddress);

  // Deploy UserProfile
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();
  console.log("✅ UserProfile deployed to:", userProfileAddress);

  // Set up output directory
  const contractsDir = path.resolve(__dirname, "../../client/src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract addresses
  const addresses = {
    decentHire: decentHireAddress,
    userProfile: userProfileAddress,
  };
  fs.writeFileSync(
    path.join(contractsDir, "contract-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  // Save ABIs
  const decentHireArtifact = await hre.artifacts.readArtifact("DecentHire");
  fs.writeFileSync(
    path.join(contractsDir, "decentHire-abi.json"),
    JSON.stringify(decentHireArtifact.abi, null, 2)
  );

  const userProfileArtifact = await hre.artifacts.readArtifact("UserProfile");
  fs.writeFileSync(
    path.join(contractsDir, "userProfile-abi.json"),
    JSON.stringify(userProfileArtifact.abi, null, 2)
  );

  console.log("✅ ABIs and addresses exported to /client/src/contracts");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
