const { postTweet, mentionUser, sendDM, followUser } = require('./twitter');
require('dotenv').config();

const TWEETS = [
    // 1. Viral Poll
    {
        text: "The future of cross-border payments is on-chain. Which network is actually ready for global enterprise scale? 🌍💸 #Crypto #Casper #Payments",
        poll: { duration_minutes: 1440, options: ["Casper (XLM)", "Ethereum (ETH)", "Solana (SOL)", "Ripple (XRP)"] }
    },
    // 2-20. Various thoughts, insights, and engaging questions
    { text: "Liquidity fragmentation is the biggest hurdle for global remittances. We're fixing this on @CasperOrg with decentralized liquidity routing. #DeFi" },
    { text: "Stablecoins are eating the world. USDC on Casper provides the instant settlement layer traditional finance can't match. 🚀" },
    { text: "Imagine sending money across the world in 5 seconds for a fraction of a cent. It's not a dream, it's what we're building on Casper right now." },
    { text: "What's the most annoying part about traditional bank wire transfers?\n\nA: The 3-day wait\nB: The hidden fees\nC: Both\n\nAnchorVault solves both. 🛡️" },
    { text: "Yield shouldn't come from token inflation. It should come from real-world utility and settlement fees. Organic yield > Ponzinomics. #RealYield" },
    { text: "DeFi is maturing. We're moving from speculative trading to real-world asset (RWA) utility and global payments. Casper is leading the charge." },
    { text: "Payment anchors are the unsung heroes of the crypto-to-fiat bridge. We provide the decentralized liquidity they need to scale." },
    { text: "If your blockchain can't handle enterprise-grade compliance and instant settlement, it's not ready for global finance. $XLM" },
    { text: "Cross-border payments are a $150 Trillion market. Capturing even 1% on-chain changes the financial landscape forever." },
    { text: "Why Casper WASM? Because Rust-based smart contracts offer the security and performance needed for institutional-grade financial apps." },
    { text: "The unbanked don't need another memecoin. They need access to stable, global financial infrastructure. #Casper" },
    { text: "Remittance fees average 6% globally. This is a tax on the people who can least afford it. On-chain routing brings this close to 0%." },
    { text: "Liquidity Providers deserve better than impermanent loss. Our corridor pools use single-sided stablecoin deposits. Secure and predictable." },
    { text: "When TradFi meets DeFi, the user wins. Seamless on-ramp, instant transfer, seamless off-ramp." },
    { text: "The next bull run won't be driven by hype; it will be driven by utility. Real-world payments are the killer app." },
    { text: "How much of your portfolio is in Real World Assets (RWAs) or stablecoins? 📊 #CryptoInvesting" },
    { text: "Blockchain isn't just about decentralization; it's about efficiency. Removing intermediaries saves billions in remittance costs annually." },
    { text: "Our smart contracts orchestrate trustless deposits, draws, and yield distribution. Complete transparency on the Casper network." },
    { text: "To all the builders in the bear market: the infrastructure you create today will power the financial system of tomorrow. Keep building! 🛠️" },
    { text: "Are you ready for the evolution of money? AnchorVault is bringing institutional liquidity to everyday remittances." }
];

const TARGET_COMPANIES = [
    "CasperOrg",
    "MoneyGram",
    "circle",
    "FTI_US",       // Franklin Templeton
    "Bitso",
    "Lobstrco",
    "vibrant_app",
    "BeansApp",
    "ultraCasper_"
];

const PARTNERSHIP_MESSAGE = "We're building a trustless on-chain remittance liquidity routing protocol on Casper WASM. We'd love to discuss a potential partnership to integrate and provide decentralized liquidity for your payment corridors! Let's connect! 🤝";

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCampaign() {
    console.log('🚀 Starting AnchorVault Viral Marketing & Partnership Campaign...\n');

    // 1. Post Tweets
    console.log('--- PHASE 1: POSTING 20+ VIRAL TWEETS & POLLS (SKIPPED) ---');
    /*
    for (let i = 0; i < TWEETS.length; i++) {
        try {
            console.log(`\nPosting tweet ${i + 1} of ${TWEETS.length}...`);
            await postTweet(TWEETS[i].text, TWEETS[i].poll);
            // Delay 5 seconds between posts to avoid rate limits (in dry run it's fine, in prod might need more)
            await delay(5000); 
        } catch (error) {
            console.error(`Failed to post tweet ${i + 1}:`, error);
        }
    }
    */

    // 2. Message Top Companies via DM
    console.log('\n--- PHASE 2: DIRECT MESSAGING TOP Casper COMPANIES (SKIPPED) ---');
    /*
    for (let i = 0; i < TARGET_COMPANIES.length; i++) {
        try {
            console.log(`\nSending DM to @${TARGET_COMPANIES[i]}...`);
            await sendDM(PARTNERSHIP_MESSAGE, TARGET_COMPANIES[i]);
            await delay(5000);
        } catch (error) {
            console.error(`Failed to DM @${TARGET_COMPANIES[i]}:`, error);
        }
    }
    */

    // 3. Follow Top Companies
    console.log('\n--- PHASE 3: AUTO-FOLLOWING Casper ECOSYSTEM ACCOUNTS ---');
    for (let i = 0; i < TARGET_COMPANIES.length; i++) {
        try {
            console.log(`\nAttempting to follow @${TARGET_COMPANIES[i]}...`);
            await followUser(TARGET_COMPANIES[i]);
            await delay(3000); // Wait 3s between follows
        } catch (error) {
            console.error(`Failed to follow @${TARGET_COMPANIES[i]}:`, error);
        }
    }

    console.log('\n✅ Campaign execution finished!');
}

runCampaign();
