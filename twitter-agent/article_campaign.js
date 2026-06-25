const { postTweet } = require('./twitter');
const path = require('path');
require('dotenv').config();

// The article formatted as a Twitter Thread
const THREAD_ARTICLE = [
    {
        text: "📜 𝗔𝗻𝗰𝗵𝗼𝗿𝗩𝗮𝘂𝗹𝘁: 𝗧𝗵𝗲 𝗘𝘃𝗼𝗹𝘂𝘁𝗶𝗼𝗻 𝗼𝗳 𝗖𝗿𝗼𝘀𝘀-𝗕𝗼𝗿𝗱𝗲𝗿 𝗣𝗮𝘆𝗺𝗲𝗻𝘁𝘀 𝗼𝗻 𝗦𝘁𝗲𝗹𝗹𝗮𝗿 🌊\n\nRemittances are broken. High fees, slow settlements, opaque intermediaries.\n\nHere is how we are building the decentralized liquidity routing protocol to fix a $150 Trillion market. 🧵 (1/5)",
        // Use the video as a GIF intro
        mediaPaths: [path.join(__dirname, '..', '7782667-hd_1080_1920_25fps.mp4')]
    },
    {
        text: "The Problem 🛑\n\nTraditional financial institutions rely on Nostro/Vostro accounts and correspondent banks. This ties up trillions of dollars in idle capital just to facilitate daily transfers. \n\nThe result? A 6% average global fee on remittances. (2/5)",
        mediaPaths: [path.join(__dirname, '..', 'website phtoo', 'Screenshot 2026-06-07 003329.png')]
    },
    {
        text: "The Solution: AnchorVault 🛡️\n\nBuilt on @CasperOrg Casper WASM, AnchorVault is a trustless on-chain liquidity layer. We bridge Liquidity Providers (LPs) directly with authorized off-ramp payment anchors. No middlemen. (3/5)",
        mediaPaths: [path.join(__dirname, '..', 'website phtoo', 'Screenshot 2026-06-07 003611.png')]
    },
    {
        text: "Real Yield, Not Emissions 📈\n\nLPs deposit USDC into our corridor pools. When anchors draw from these pools for instant payouts, they pay a utilization fee.\n\nThis fee goes directly to our LPs. Organic yield derived from real-world economic activity. (4/5)",
        mediaPaths: [path.join(__dirname, '..', 'website phtoo', 'Screenshot 2026-06-07 003538.png')]
    },
    {
        text: "Join the Future of Money 🚀\n\nAnchorVault brings institutional liquidity to everyday remittances, empowering the unbanked and redefining global finance.\n\nRead our full architecture docs at our website. Let's build! #Casper #DeFi (5/5)",
        mediaPaths: []
    }
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function postArticleThread() {
    console.log('🚀 Starting AnchorVault High-Quality Article Thread...\n');
    let previousId = null;

    for (let i = 0; i < THREAD_ARTICLE.length; i++) {
        try {
            console.log(`\nPosting part ${i + 1} of ${THREAD_ARTICLE.length}...`);
            const tweet = THREAD_ARTICLE[i];
            
            // Post the tweet, passing media and the ID of the previous tweet in the thread
            const result = await postTweet(tweet.text, null, tweet.mediaPaths, previousId);
            
            // Save the ID to chain the next tweet to it
            previousId = result.data.id;
            
            // Delay 10 seconds to ensure media processing and rate limit safety
            await delay(10000); 
        } catch (error) {
            console.error(`Failed to post thread part ${i + 1}:`, error);
            break; // Stop the thread if one part fails
        }
    }
    console.log('\n✅ Article Thread successfully published!');
}

postArticleThread();
