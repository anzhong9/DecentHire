const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
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

  // Export addresses and ABIs to frontend
  const contractsDir = path.resolve(__dirname, "../../client/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "decentHire-address.json"),
    JSON.stringify({ address: decentHireAddress }, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "userProfile-address.json"),
    JSON.stringify({ address: userProfileAddress }, null, 2)
  );

  const decentHireArtifact = await hre.artifacts.readArtifact("DecentHire");
  const userProfileArtifact = await hre.artifacts.readArtifact("UserProfile");

  fs.writeFileSync(
    path.join(contractsDir, "decentHire-abi.json"),
    JSON.stringify(decentHireArtifact.abi, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "userProfile-abi.json"),
    JSON.stringify(userProfileArtifact.abi, null, 2)
  );

  console.log("✅ ABIs and addresses exported to /client/src/contracts");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
