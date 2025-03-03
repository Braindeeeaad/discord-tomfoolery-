const axios = require('axios');
const dotenv = require('dotenv'); 
dotenv.config();


const makeDiscordPoll = async(channelId, question, answers, duration = 24, allowMultiselect = false) => {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

    const payload = {
        content: "Here's a poll!",
        poll: {
            question: { text: question },
            answers: answers.map(answer => ({ poll_media: { text: answer } })),
            duration,
            allow_multiselect: allowMultiselect
        }
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Poll created:', response.data);
    } catch (error) {
        console.error('Error creating poll:', error.response ? error.response.data : error.message);
    }
}

module.exports = {makeDiscordPoll};
