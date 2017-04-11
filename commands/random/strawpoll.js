const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class StrawpollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'strawpoll',
            aliases: [
                'poll',
                'survey'
            ],
            group: 'random',
            memberName: 'strawpoll',
            description: 'Creates a Strawpoll with your options. (;strawpoll "Who likes chips?" "Me" "Not Me")',
            examples: [';strawpoll "Who likes chips?" "Me" "Not Me"'],
            args: [{
                key: 'title',
                prompt: 'What would you like the title of the Strawpoll to be? Surround in "" for multiple words.',
                type: 'string',
                validate: title => {
                    if (title.length > 200) {
                        return 'Please limit your title to 200 characters.';
                    }
                    return true;
                }
            }, {
                key: 'choices',
                prompt: 'What choices do you want me pick from? Surround each choice in "".',
                type: 'string',
                infinite: true
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const title = args.title;
        const choices = args.choices;
        if (choices.length < 2) return message.say(':x: Error! You provided less than two choices!');
        if (choices.length > 31) return message.say(':x: Error! You provided more than thirty choices!');
        try {
            const response = await request
                .post('https://strawpoll.me/api/v2/polls')
                .send({
                    title: title,
                    options: choices
                });
            const data = response.body;
            return message.say(`${data.title}\nhttp://strawpoll.me/${data.id}`);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
