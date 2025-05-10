// Script to check if an address has MINTER_ROLE
const { ethers } = require('ethers');
require('dotenv').config();

// SimpleTSHC ABI (only the functions we need)
const abi = [
  "function MINTER_ROLE() public view returns (bytes32)",
  "function hasRole(bytes32 role, address account) public view returns (bool)"
];

async function main() {
  // Get arguments from command line
  const addressToCheck = process.argv[2];
  if (!addressToCheck) {
    console.error("Please provide an address to check for MINTER_ROLE");
    process.exit(1);
  }

  // Connect to provider
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  
  // Connect to TSHC contract
  const tshcAddress = process.env.TSHC_CONTRACT_ADDRESS;
  const tshcContract = new ethers.Contract(tshcAddress, abi, provider);
  
  // Get MINTER_ROLE bytes32 value
  const minterRole = await tshcContract.MINTER_ROLE();
  console.log(`MINTER_ROLE: ${minterRole}`);
  
  // Check if address has MINTER_ROLE
  const hasRole = await tshcContract.hasRole(minterRole, addressToCheck);
  console.log(`Address ${addressToCheck} ${hasRole ? 'has' : 'does not have'} MINTER_ROLE`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
