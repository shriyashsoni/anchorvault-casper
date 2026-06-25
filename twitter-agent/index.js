const cron = require('cron');
const fs = require('fs');
const path = require('path');
const { generateTweetContent, generateReplyContent } = require('./ai');
const { postTweet, mentionUser, searchTweets } = require('./twitter');
require('dotenv').config();

console.log('🚀 AnchorVault Twitter AI Agent starting up...');
console.log(`Environment: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION (Live Posting)' : 'DEVELOPMENT (Dry Run)'}`);

// Local DB to remember which tweets we've replied to
const DB_PATH = path.join(__dirname, 'replied_tweets.json');

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

function getRepliedTweets() {
    try {
        const data = fs.readFileSync(DB_PATH);
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveRepliedTweet(tweetId) {
    const replied = getRepliedTweets();
    if (!replied.includes(tweetId)) {
        replied.push(tweetId);
        // Keep memory small
        if (replied.length > 1000) replied.shift();
        fs.writeFileSync(DB_PATH, JSON.stringify(replied));
    }
}

// Action 1: Post the daily advanced tweet
async function runPostAction() {
    console.log(`\n[${new Date().toISOString()}] Starting daily post action...`);
    try {
        console.log('Generating advanced tweet content...');
        const tweetText = await generateTweetContent();
        
        console.log('Attempting to post tweet...');
        await postTweet(tweetText);

        console.log('Post action completed successfully.');
    } catch (error) {
        console.error('Post action failed:', error);
    }
}

// Action 2: Search for Casper tweets and reply
async function runReplyAction() {
    console.log(`\n[${new Date().toISOString()}] Starting auto-reply action...`);
    try {
        const query = 'Casper (network OR XLM OR crypto)';
        console.log(`Searching for tweets matching: ${query}`);
        const tweets = await searchTweets(query);
        
        if (tweets.length === 0) {
            console.log('No recent tweets found or search API blocked.');
            return;
        }

        const repliedTweets = getRepliedTweets();
        let repliedCount = 0;

        for (const tweet of tweets) {
            // Max 2 replies per run to avoid spam
            if (repliedCount >= 2) break;

            if (!repliedTweets.includes(tweet.id)) {
                console.log(`Found new tweet to engage with: "${tweet.text.substring(0, 50)}..."`);
                
                console.log('Generating contextual reply...');
                const replyText = await generateReplyContent(tweet.text);
                
                if (tweet.username) {
                    console.log(`Attempting to mention @${tweet.username}...`);
                    await mentionUser(replyText, tweet.username);
                    saveRepliedTweet(tweet.id);
                    repliedCount++;
                }
                
                // Sleep 5s between replies
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        
        console.log(`Reply action completed. Replied to ${repliedCount} tweets.`);
    } catch (error) {
        console.error('Reply action failed:', error);
    }
}

// Schedule the Daily Post job (3 times a day: 9AM, 2PM, 7PM)
const postJob = new cron.CronJob('0 9,14,19 * * *', async () => {
    await runPostAction();
});
postJob.start();

// Schedule the Auto-Reply job (runs every 4 hours)
const replyJob = new cron.CronJob('0 */4 * * *', async () => {
    await runReplyAction();
});
replyJob.start();

console.log(`Post Job scheduled. Next at: ${postJob.nextDate().toISO()}`);
console.log(`Reply Job scheduled. Next at: ${replyJob.nextDate().toISO()}`);

// Optional: Run the reply action once immediately on startup for testing
console.log('\nRunning initial immediate reply execution for testing...');
runReplyAction();
