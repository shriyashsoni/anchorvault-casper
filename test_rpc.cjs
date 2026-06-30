const { CasperServiceByJsonRPC } = require('casper-js-sdk');

const rpc = new CasperServiceByJsonRPC("https://rpc.testnet.casperlabs.io/rpc");

async function main() {
    try {
        const stateRootHash = await rpc.getStateRootHash();
        console.log("State Root Hash:", stateRootHash);
        
        // Let's try to query a contract
        const contractHash = "hash-814117b2cb4f5b63a8ba1f5abb0bbfd11b576fd2b7bbaf23a101b74dbbbfeb4c";
        
        const result = await rpc.getBlockState(stateRootHash, contractHash, []);
        console.log("Contract State:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
