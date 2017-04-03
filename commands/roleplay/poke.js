const commando = require('discord.js-commando');

module.exports = class PokeCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'poke',
            group: 'roleplay',
            memberName: 'poke',
            description: 'Pokes someone. (;poke @User)',
            examples: [';poke @User'],
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const thingToRoleplay = args.thing;
        return message.say(`${message.author} *pokes* ${thingToRoleplay}`);
    }
};
