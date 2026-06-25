const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const { Keys } = require('casper-js-sdk');
const fs = require('fs');

async function main() {
    const mnemonic = "awkward vivid skull shed output pilot mimic hurt peace behave genre stable season sail neck lava split gate ticket dress reflect miss broom ridge";
    
    // Validate mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
        console.error("Invalid mnemonic");
        process.exit(1);
    }

    // Generate seed from mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Casper derivation path for Ed25519
    const derivationPath = "m/44'/506'/0'/0'/0'";
    
    // Derive key
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
    
    // Generate Casper Keypair (Ed25519)
    const keyPair = Keys.Ed25519.parsePrivateKey(derivedSeed);

    // Write PEM files
    const secretKeyPem = keyPair.exportPrivateKeyInPem();
    const publicKeyPem = keyPair.exportPublicKeyInPem();

    fs.writeFileSync('secret_key.pem', secretKeyPem);
    fs.writeFileSync('public_key.pem', publicKeyPem);

    console.log("Keys successfully generated from mnemonic!");
    console.log("Public Key Hex:", keyPair.publicKey.toHex());
}

main().catch(console.error);
