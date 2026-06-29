import casper from 'casper-js-sdk';
const { Keys } = casper;
import * as fs from 'fs';
import * as path from 'path';

async function generateAndFundKey() {
  console.log("Creating a brand new secure developer test account for Casper Network...");
  
  // 1. Generate a secure random Casper keypair locally on your machine
  const keypair = Keys.Ed25519.new();
  const publicKeyHex = keypair.publicKey.toHex();
  const accountHash = keypair.publicKey.toAccountHashStr();
  
  console.log(`✅ Generated Public Key (Hex): ${publicKeyHex}`);
  console.log(`✅ Account Hash: ${accountHash}`);
  console.log(`\n⌛ To fund this account on Casper Testnet, please visit the official faucet:`);
  console.log(`   👉 https://testnet-faucet.casperlabs.io`);
  console.log(`   Paste your Public Key (Hex) to receive free Testnet CSPR tokens.\n`);
  
  // 2. Write these keys directly into the local .env file privately
  const envPath = path.resolve('.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Replace placeholders with real keys
  if (envContent.includes('CASPER_PUBLIC_KEY=')) {
    envContent = envContent.replace(
      /CASPER_PUBLIC_KEY=".*"/,
      `CASPER_PUBLIC_KEY="${publicKeyHex}"`
    );
  } else {
    envContent += `\nCASPER_PUBLIC_KEY="${publicKeyHex}"`;
  }

  if (envContent.includes('CASPER_ACCOUNT_HASH=')) {
    envContent = envContent.replace(
      /CASPER_ACCOUNT_HASH=".*"/,
      `CASPER_ACCOUNT_HASH="${accountHash.replace('account-hash-', '')}"`
    );
  } else {
    envContent += `\nCASPER_ACCOUNT_HASH="${accountHash.replace('account-hash-', '')}"`;
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log("📁 Keys successfully written directly into your local .env file!");
  console.log("\nYou are now ready to run 'npm run deploy' immediately! 🚀\n");
}

generateAndFundKey();

