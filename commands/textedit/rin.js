const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class RinSayCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'rin',
            aliases: [
                'rinsay'
            ],
            group: 'textedit',
            memberName: 'rin',
            description: "Posts a message to the Rin webhook in Heroes of Dreamland. (;rin Hey guys!)",
            examples: [";rin Hey guys!"]
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let rinContent = message.content.split(" ").slice(1).join(" ");
        try {
            let post = await request
                .post(config.webhook)
                .send({
                    content: rinContent
                });
            if (message.content.type !== 'dm') {
                message.delete();
            }
        }
        catch (err) {
            message.channel.send(':x: Error! Message failed to send!');
        }
    }
};
