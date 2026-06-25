const { likeTweet, retweet, mentionUser, sendDM, followUser } = require('./twitter');
const { TwitterApi } = require('twitter-api-v2');
const { generateReplyContent } = require('./ai');

const OAUTH2_TOKEN = "OUd6ZHRQMVVQT2l3cm5la1FEUmdCWERXOFBNM19lS0JiZVBETHhyaGk0NFB5OjE3ODIzMzYyMzc0OTY6MTowOmF0OjE";
const client = new TwitterApi(OAUTH2_TOKEN);
const rwClient = client.readWrite;

const PARTNERSHIP_MESSAGE = "We're building AnchorVault, a trustless on-chain remittance liquidity routing protocol on Casper WASM. We'd love to discuss a potential partnership to integrate and provide decentralized liquidity for your payment corridors! Let's connect! 🤝";

const PROCESSED_TWEETS = new Set();
const TARGET_COMPANIES = ["CasperOrg", "MoneyGram", "circle", "FTI_US", "Bitso"];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runMassiveCampaign() {
    console.log('🚀 Starting AnchorVault MASSIVE Ecosystem Campaign Cycle...');

    while (true) {
        console.log(`\n--- Starting new cycle at ${new Date().toLocaleTimeString()} ---`);
        for (const target of TARGET_COMPANIES) {
        console.log(`\n--- Engaging with @${target} ---`);

        try {
            // Fetch User
            const user = await rwClient.v2.userByUsername(target);
            if (!user || !user.data) {
                console.log(`Could not fetch user @${target}`);
                continue;
            }
            
            // Follow
            console.log('Following...');
            await followUser(target);
            await delay(1000);

            // DM
            console.log('Sending DM...');
            await sendDM(PARTNERSHIP_MESSAGE, target);
            await delay(1000);

            // Get Recent Tweet
            console.log('Fetching recent tweet to like/retweet/comment...');
            const timeline = await rwClient.v2.userTimeline(user.data.id, { max_results: 5 });
            
            // Note: twitter-api-v2 userTimeline returns an object where .data.data is the tweet array
            const tweets = (timeline && timeline.data && timeline.data.data) || [];
            
            if (tweets.length > 0) {
                const recentTweet = tweets[0];
                
                if (PROCESSED_TWEETS.has(recentTweet.id)) {
                    console.log(`Already interacted with tweet ${recentTweet.id}. Skipping...`);
                    continue;
                }
                
                // Like
                console.log(`Liking tweet ${recentTweet.id}...`);
                await likeTweet(recentTweet.id);
                await delay(1000);
                
                // Retweet
                console.log(`Retweeting tweet ${recentTweet.id}...`);
                await retweet(recentTweet.id);
                await delay(1000);
                
                // Comment
                console.log(`Commenting on tweet ${recentTweet.id}...`);
                const replyText = await generateReplyContent(recentTweet.text);
                await mentionUser(replyText, target); 
                await delay(1000);
                
                PROCESSED_TWEETS.add(recentTweet.id);
            } else {
                console.log(`No recent tweets found for @${target}`);
            }
        } catch (error) {
            console.error(`Failed during engagement with @${target}:`, error.message);
        }
    }
    
    console.log('\n⏳ Cycle finished. Waiting 1 second before next cycle...');
    await delay(1000); // Wait 1 second
  }
}

runMassiveCampaign();
