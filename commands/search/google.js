const commando = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = class DefineCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'google',
            aliases: [
                'search'
            ],
            group: 'search',
            memberName: 'google',
            description: 'Searches Google. (;google Cat)',
            examples: [';google Cat'],
            args: [{
                key: 'query',
                prompt: 'What would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToSearch = encodeURI(args.query);
        let searchMsg = await message.channel.send('Searching...');
        try {
            let response = await request
                .get(`https://www.google.com/search?q=${thingToSearch}`);
            const $ = cheerio.load(response.text);
            let href = $('.r').first().find('a').first().attr('href');
            if (!href) return Promise.reject(new Error('NO RESULTS'));
            href = querystring.parse(href.replace('/url?', ''));
            return searchMsg.edit(href.q);
        }
        catch (err) {
            return searchMsg.edit(':x: Error! No Results Found!');
        }
    }
};
