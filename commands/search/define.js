const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class DefineCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'define',
            group: 'search',
            memberName: 'define',
            description: 'Defines a word.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to define?',
                    type: 'string',
                    parse: query => encodeURIComponent(query)
                }
            ]
        });
    }

    async run(msg, args) {
        if(msg.channel.type !== 'dm')
            if(!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`http://api.wordnik.com:80/v4/word.json/${query}/definitions?limit=1&includeRelated=false&useCanonical=false&api_key=${process.env.WORDNIK_KEY}`);
            if(body.length === 0) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setTitle(body[0].word)
                .setDescription(body[0].text);
            return msg.embed(embed);
        } catch(err) {
            return msg.say(`An Error Occurred: ${err}`);
        }
    }
};
