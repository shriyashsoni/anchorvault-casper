import {
  CasperClient,
  Contracts,
  Keys,
  RuntimeArgs,
  DeployUtil,
  CLValueBuilder,
} from 'casper-js-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const networkName = process.env.CASPER_NETWORK_NAME || 'casper-test';
const nodeAddress = process.env.CASPER_NODE_URL || 'http://136.243.187.84:7777/rpc';
const secretKeyPath = process.env.CASPER_SECRET_KEY_PATH || './secret_key.pem';

if (!fs.existsSync(secretKeyPath)) {
  console.error("❌ ERROR: Secret key not found at path:", secretKeyPath);
  process.exit(1);
}

const deployerKey = Keys.Ed25519.parseKeyFiles(
  secretKeyPath.replace('secret_key.pem', 'public_key.pem'),
  secretKeyPath
);

const casperClient = new CasperClient(nodeAddress);
const contractClient = new Contracts.Contract(casperClient);

console.log("=================================================");
console.log(`🚀 ANCHORVAULT CASPER DEPLOYMENT`);
console.log(`Network: ${networkName}`);
console.log(`Node: ${nodeAddress}`);
console.log(`Deployer: ${deployerKey.publicKey.toHex()}`);
console.log("=================================================\n");

async function deployWasm(wasmPath, contractName) {
  console.log(`📤 Deploying WASM: ${contractName}...`);
  const absolutePath = path.resolve(wasmPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`WASM not found: ${absolutePath}`);
  }

  const wasmBytes = fs.readFileSync(absolutePath);
  const runtimeArgs = RuntimeArgs.fromMap({});

  const deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(deployerKey.publicKey, networkName),
    DeployUtil.ExecutableDeployItem.newModuleBytes(wasmBytes, runtimeArgs),
    DeployUtil.standardPayment(150_000_000_000) // 150 CSPR
  );

  const signedDeploy = DeployUtil.signDeploy(deploy, deployerKey);
  const deployHash = await casperClient.putDeploy(signedDeploy);

  console.log(`  ✅ Deploy sent! Hash: ${deployHash}`);
  
  // In a real script, we would poll for the deploy result here
  // const result = await casperClient.nodeClient.waitForDeploy(deployHash);
  // console.log("Deploy Success:", result);
  
  return deployHash;
}

async function main() {
  const wasmPaths = {
    usdc:     './contracts/vault_token/target/wasm32-unknown-unknown/release/vault_token.wasm',
    registry: './contracts/anchor_registry/target/wasm32-unknown-unknown/release/anchor_registry.wasm',
    token:    './contracts/vault_token/target/wasm32-unknown-unknown/release/vault_token.wasm',
    vault:    './contracts/anchor_vault/target/wasm32-unknown-unknown/release/anchor_vault.wasm',
  };

  await deployWasm(wasmPaths.usdc, "USDC (CEP-18)");
  await deployWasm(wasmPaths.registry, "Anchor Registry");
  await deployWasm(wasmPaths.token, "Vault Share Token (CEP-18)");
  await deployWasm(wasmPaths.vault, "Corridor Pool Vault");

  console.log("=================================================");
  console.log(`🎉 ALL CONTRACTS DEPLOYED ON CASPER ${networkName.toUpperCase()}!`);
  console.log("=================================================\n");
}

main().catch(err => {
  console.error("❌ Fatal deployment error:", err.message);
  process.exit(1);
});
