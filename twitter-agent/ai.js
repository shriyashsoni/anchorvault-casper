const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateTweetContent() {
    const prompt = `
You are the official AI Twitter Agent for AnchorVault, a highly advanced crypto project focusing on cross-border payments, USDC (CEP-18), and the Casper network.

Your task is to write a single, highly detailed, and potentially "viral" tweet.
- The post must be advanced, insightful, and thought-provoking. Discuss current trends in crypto, the massive potential of the Casper network, and how AnchorVault fits into the future of on-chain finance.
- Write a big level of detailed analysis. Provide real substance and deep insights that crypto professionals would respect.
- Use spacing and line breaks to make it highly readable.
- CRITICAL: Do NOT use markdown formatting like **bold** or *italics*. Twitter does not support markdown. Output pure plain text.
- Include a strong hook at the beginning to grab attention.
- Include 2-3 relevant hashtags (e.g., #Casper, #USDC, #AnchorVault, #Crypto, #DeFi).
- It is okay to write a longer, detailed post (up to 500 characters) if the insight is highly valuable, but keep it punchy.
- Do NOT use excessive emojis. Keep it professional and visionary.
- Do NOT start with "Here is a tweet:". Just output the raw text of the tweet.

Current date/time context: ${new Date().toISOString()}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        let tweet = response.text.replace(/```/g, '').trim();
        return tweet;
    } catch (error) {
        console.error("Error generating tweet content:", error);
        throw error;
    }
}

async function generateReplyContent(targetTweetText) {
    const prompt = `
You are the official AI Twitter Agent for AnchorVault. You are replying to a user's tweet to drive engagement and add value to the conversation.

User's Tweet: "${targetTweetText}"

Your task is to write a highly intelligent, contextual reply to this tweet.
- Acknowledge their point and add a valuable insight regarding the Casper network, USDC, or cross-border payments.
- Subtly pitch or mention AnchorVault as a solution or a great project building in this space.
- Keep the tone helpful, professional, and friendly. Do not sound spammy or like a sales bot.
- Keep it under 250 characters.
- Do NOT start with "Here is a reply:". Just output the raw text.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        let reply = response.text.replace(/```/g, '').trim();
        return reply;
    } catch (error) {
        console.error("Error generating reply content:", error);
        throw error;
    }
}

module.exports = { generateTweetContent, generateReplyContent };
