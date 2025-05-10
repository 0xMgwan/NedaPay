// Script to add ABSA Bank to the NEDA Pay admin portal
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const adminPortalDir = path.join(projectRoot, 'admin-portal');

// 1. Add ABSA Bank to MintBurn.tsx organization dropdowns
const mintBurnPath = path.join(adminPortalDir, 'src', 'pages', 'MintBurn.tsx');
let mintBurnContent = fs.readFileSync(mintBurnPath, 'utf8');

// Add to both dropdown menus
mintBurnContent = mintBurnContent.replace(
  /<MenuItem value="Ministry of Finance">Ministry of Finance<\/MenuItem>\s*<\/Select>/g,
  '<MenuItem value="Ministry of Finance">Ministry of Finance</MenuItem>\n                  <MenuItem value="ABSA Bank">ABSA Bank</MenuItem>\n                </Select>'
);

fs.writeFileSync(mintBurnPath, mintBurnContent);
console.log('✅ Added ABSA Bank to MintBurn.tsx organization dropdowns');

// 2. Add ABSA Bank to KYC Management mock data
const kycPath = path.join(adminPortalDir, 'src', 'pages', 'KycManagement.tsx');
let kycContent = fs.readFileSync(kycPath, 'utf8');

// Find the last mock KYC entry and its ID
const lastIdMatch = kycContent.match(/id: (\d+),\s*name:/);
const lastId = lastIdMatch ? parseInt(lastIdMatch[1]) : 0;
const newId = lastId + 1;

// Create a new ABSA Bank entry
const absaBankEntry = `  { 
    id: ${newId}, 
    name: 'ABSA Bank', 
    type: 'Financial Institution', 
    submissionDate: '2025-04-05', 
    status: 'Rejected', 
    verifiedBy: 'Maria Johnson',
    verificationDate: '2025-04-06',
    documents: 3
  },`;

// Add the new entry to the mock data array
kycContent = kycContent.replace(
  /const mockKycData = \[\s*{/,
  `const mockKycData = [\n${absaBankEntry}\n  {`
);

fs.writeFileSync(kycPath, kycContent);
console.log('✅ Added ABSA Bank to KycManagement.tsx mock data');

// 3. Add ABSA Bank to any other relevant mock data in the admin portal
const web3ServicePath = path.join(adminPortalDir, 'src', 'services', 'web3Service.ts');
let web3ServiceContent = fs.readFileSync(web3ServicePath, 'utf8');

// Add ABSA Bank to mock transactions if they exist
if (web3ServiceContent.includes('organization:')) {
  // Add a new mock transaction for ABSA Bank
  const absaTransaction = `    { id: ${Date.now()}, type: 'Mint', amount: 750000, date: '2025-04-10', organization: 'ABSA Bank', reason: 'New partnership' },`;
  
  web3ServiceContent = web3ServiceContent.replace(
    /transactions: \[\s*{/,
    `transactions: [\n${absaTransaction}\n    {`
  );
  
  fs.writeFileSync(web3ServicePath, web3ServiceContent);
  console.log('✅ Added ABSA Bank to web3Service.ts mock transactions');
}

console.log('🎉 Successfully added ABSA Bank to the NEDA Pay admin portal');
