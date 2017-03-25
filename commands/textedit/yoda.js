const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class YodaCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'yoda',
            group: 'textedit',
            memberName: 'yoda',
            description: 'Converts text to Yoda Speak. (;yoda This is Yoda.)',
            examples: [';yoda This is Yoda.'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to Yoda speak?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let turnToYoda = args.text;
        try {
            let response = await request
                .get('https://yoda.p.mashape.com/yoda')
                .set({
                    'X-Mashape-Key': config.mashapekey,
                    'Accept': 'text/plain'
                })
                .query({
                    sentence: turnToYoda
                });
            if (!response.text) return message.channel.send(':x: Error! Something went wrong! Keep it simple to avoid this error.');
            return message.channel.send(response.text);
        }
        catch (err) {
            return message.channel.send(":x: Error! Something went wrong!");
        }
    }
};
