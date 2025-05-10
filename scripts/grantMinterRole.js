// Script to grant MINTER_ROLE to new addresses
const { ethers } = require('ethers');
require('dotenv').config();

// SimpleTSHC ABI (only the functions we need)
const abi = [
  "function grantRole(bytes32 role, address account) public",
  "function MINTER_ROLE() public view returns (bytes32)",
  "function hasRole(bytes32 role, address account) public view returns (bool)"
];

async function main() {
  // Get arguments from command line
  const newMinterAddress = process.argv[2];
  if (!newMinterAddress) {
    console.error("Please provide an address to grant MINTER_ROLE to");
    process.exit(1);
  }

  // Connect to provider
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  
  // Load wallet from private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(`Connected with wallet: ${wallet.address}`);
  
  // Connect to TSHC contract
  const tshcAddress = process.env.TSHC_CONTRACT_ADDRESS;
  const tshcContract = new ethers.Contract(tshcAddress, abi, wallet);
  
  // Get MINTER_ROLE bytes32 value
  const minterRole = await tshcContract.MINTER_ROLE();
  console.log(`MINTER_ROLE: ${minterRole}`);
  
  // Check if address already has MINTER_ROLE
  const hasRole = await tshcContract.hasRole(minterRole, newMinterAddress);
  if (hasRole) {
    console.log(`Address ${newMinterAddress} already has MINTER_ROLE`);
    process.exit(0);
  }
  
  // Grant MINTER_ROLE to the address
  console.log(`Granting MINTER_ROLE to ${newMinterAddress}...`);
  const tx = await tshcContract.grantRole(minterRole, newMinterAddress);
  console.log(`Transaction hash: ${tx.hash}`);
  
  // Wait for transaction to be mined
  console.log("Waiting for transaction to be mined...");
  await tx.wait();
  
  // Verify role was granted
  const hasRoleAfter = await tshcContract.hasRole(minterRole, newMinterAddress);
  if (hasRoleAfter) {
    console.log(`Successfully granted MINTER_ROLE to ${newMinterAddress}`);
  } else {
    console.error(`Failed to grant MINTER_ROLE to ${newMinterAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
