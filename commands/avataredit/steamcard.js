const { Command } = require('discord.js-commando');
const Jimp = require('jimp');

module.exports = class SteamCardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steamcard',
            aliases: [
                'card'
            ],
            group: 'avataredit',
            memberName: 'steamcard',
            description: 'Put an avatar on a Steam Card. (x;steamcard @User)',
            examples: ['x;steamcard @user'],
            args: [{
                key: 'user',
                prompt: 'Which user would you like to edit the avatar of?',
                type: 'user'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const { user } = args;
        const userAvatar = user.displayAvatarURL.replace('.jpg', '.png').replace('.gif', '.png');
        const blank = new Jimp(494, 568, 0xFFFFFF);
        let images = [];
        images.push(Jimp.read(userAvatar));
        images.push(Jimp.read('./images/SteamCard.png'));
        const [avatar, steamcard] = await Promise.all(images);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        avatar.resize(450, 450);
        blank.composite(avatar, 25, 25);
        blank.composite(steamcard, 0, 0);
        blank.print(font, 38, 20, user.username);
        blank.getBuffer(Jimp.MIME_PNG, (err, buff) => {
            if (err) return message.say(':x: Error! Something went wrong!');
            return message.channel.send({files: [{attachment: buff}]});
        });
    }
};
