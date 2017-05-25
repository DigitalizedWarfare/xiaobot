const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { promisify } = require('tsubaki');
const xml = promisify(require('xml2js').parseString);

module.exports = class Rule34Command extends Command {
    constructor(client) {
        super(client, {
            name: 'rule34',
            group: 'search',
            memberName: 'rule34',
            description: 'Sends an image from Rule34, with query.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to search for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        if (!msg.channel.nsfw) return msg.say('This Command can only be used in NSFW Channels.');
        const { query } = args;
        try {
            const { text } = await snekfetch
                .get('https://rule34.xxx/index.php')
                .query({
                    page: 'dapi',
                    s: 'post',
                    q: 'index',
                    tags: query,
                    limit: 1
                });
            const { posts } = await xml(text);
            if (posts.$.count === '0') throw new Error('No Results.');
            return msg.say(`Result for ${query}: https:${posts.post[0].$.file_url}`);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
