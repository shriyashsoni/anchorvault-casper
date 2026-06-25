const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

// Client for v1.1 endpoints (like Media Uploads)
const v1Client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Use the user-provided OAuth 2.0 Access Token with all permissions for v2
const OAUTH2_TOKEN = "OUd6ZHRQMVVQT2l3cm5la1FEUmdCWERXOFBNM19lS0JiZVBETHhyaGk0NFB5OjE3ODIzMzYyMzc0OTY6MTowOmF0OjE";
const client = new TwitterApi(OAUTH2_TOKEN);

const rwClient = client.readWrite;

async function postTweet(text, poll = null, mediaPaths = [], replyToId = null) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('\n--- [DRY RUN] Would have posted tweet ---');
        console.log(text);
        if (poll) console.log('Poll Options:', poll.options);
        if (mediaPaths && mediaPaths.length > 0) console.log('Media Attachments:', mediaPaths);
        console.log('-----------------------------------------\n');
        return { data: { id: "dry-run-id" } };
    }

    try {
        const payload = typeof text === 'string' ? { text } : text;
        
        if (poll && typeof text === 'string') {
            payload.poll = poll;
        }

        if (mediaPaths && mediaPaths.length > 0) {
            const mediaIds = await Promise.all(
                mediaPaths.map(path => {
                    const mimeType = path.endsWith('.mp4') ? 'video/mp4' : undefined;
                    return v1Client.v1.uploadMedia(path, { mimeType });
                })
            );
            payload.media = { media_ids: mediaIds };
        }

        if (replyToId) {
            payload.reply = { in_reply_to_tweet_id: replyToId };
        }

        const result = await rwClient.v2.tweet(payload);
        console.log(`Successfully tweeted! ID: ${result.data.id}`);
        return result;
    } catch (error) {
        console.error('Error posting tweet:', error);
        throw error;
    }
}

async function mentionUser(text, username) {
    const fullText = `@${username} ${text}`;
    
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n--- [DRY RUN] Would have mentioned @${username} ---`);
        console.log(fullText);
        console.log('-----------------------------------------\n');
        return { data: { id: "dry-run-reply-id" } };
    }

    try {
        // Twitter restricts bots from replying directly to or quoting strangers to prevent spam.
        // Instead, we create a standalone tweet that mentions their username!
        const result = await rwClient.v2.tweet(fullText);
        console.log(`Successfully mentioned! ID: ${result.data.id}`);
        return result;
    } catch (error) {
        console.error('Error mentioning user:', error);
        throw error;
    }
}

async function searchTweets(query) {
    try {
        // Search recent tweets and include author expansions to get the username
        const searchResult = await rwClient.v2.search(`${query} -is:retweet -is:reply`, {
            'tweet.fields': ['created_at', 'author_id', 'text'],
            expansions: ['author_id'],
            'user.fields': ['username'],
            max_results: 10
        });
        
        if (!searchResult.data || searchResult.data.length === 0) return [];

        const users = searchResult.includes?.users || [];
        return searchResult.data.map(tweet => {
            const user = users.find(u => u.id === tweet.author_id);
            return {
                ...tweet,
                username: user ? user.username : null
            };
        });
    } catch (error) {
        console.error('Error searching tweets:', error);
        return [];
    }
}

async function sendDM(text, username) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n--- [DRY RUN] Would have DMed @${username} ---`);
        console.log(text);
        console.log('-----------------------------------------\n');
        return { data: { dm_conversation_id: "dry-run-dm-id" } };
    }

    try {
        // 1. Lookup user ID by username
        const user = await rwClient.v2.userByUsername(username);
        if (!user || !user.data) {
            throw new Error(`User @${username} not found.`);
        }
        const userId = user.data.id;
        
        // 2. Send DM
        const result = await rwClient.v2.sendDmToParticipant(userId, { text });
        console.log(`Successfully DMed @${username}!`);
        return result;
    } catch (error) {
        console.error(`Error sending DM to @${username}:`, error);
        throw error;
    }
}

let cachedMyId = null;

async function followUser(targetUsername) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n--- [DRY RUN] Would have followed @${targetUsername} ---`);
        return { data: { following: true } };
    }

    try {
        if (!cachedMyId) {
            const me = await rwClient.v2.me();
            cachedMyId = me.data.id;
        }
        
        const targetUser = await rwClient.v2.userByUsername(targetUsername);
        if (!targetUser || !targetUser.data) {
            throw new Error(`User @${targetUsername} not found.`);
        }
        
        const result = await rwClient.v2.follow(cachedMyId, targetUser.data.id);
        console.log(`Successfully followed @${targetUsername}!`);
        return result;
    } catch (error) {
        console.error(`Error following @${targetUsername}:`, error);
        throw error;
    }
}

async function likeTweet(tweetId) {
    if (process.env.NODE_ENV !== 'production') return { data: { liked: true } };
    try {
        if (!cachedMyId) {
            const me = await rwClient.v2.me();
            cachedMyId = me.data.id;
        }
        const result = await rwClient.v2.like(cachedMyId, tweetId);
        console.log(`Successfully liked tweet ${tweetId}!`);
        return result;
    } catch (error) {
        console.error(`Error liking tweet ${tweetId}:`, error);
        throw error;
    }
}

async function retweet(tweetId) {
    if (process.env.NODE_ENV !== 'production') return { data: { retweeted: true } };
    try {
        if (!cachedMyId) {
            const me = await rwClient.v2.me();
            cachedMyId = me.data.id;
        }
        const result = await rwClient.v2.retweet(cachedMyId, tweetId);
        console.log(`Successfully retweeted tweet ${tweetId}!`);
        return result;
    } catch (error) {
        console.error(`Error retweeting tweet ${tweetId}:`, error);
        throw error;
    }
}

module.exports = { postTweet, mentionUser, searchTweets, sendDM, followUser, likeTweet, retweet };
