const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class DefineCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'define',
            aliases: [
                'definition',
                'defineword',
                'dictionary',
                'wordnik'
            ],
            group: 'search',
            memberName: 'define',
            description: 'Defines a word. (;define Cat)',
            examples: [';define Cat'],
            args: [{
                key: 'word',
                prompt: 'What would you like to define?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let defineThis = encodeURI(args.word);
        try {
            let response = await request
                .get(`http://api.wordnik.com:80/v4/word.json/${defineThis}/definitions`)
                .query({
                    limit: 1,
                    includeRelated: false,
                    useCanonical: false,
                    includeTags: false,
                    api_key: config.wordnikkey
                });
            const embed = new Discord.RichEmbed()
                .setColor(0x9797FF)
                .setTitle(response.body[0].word)
                .setDescription(response.body[0].text);
            return message.channel.sendEmbed(embed);
        }
        catch (err) {
            return message.channel.send(":x: Error! Word not Found!");
        }
    }
};
