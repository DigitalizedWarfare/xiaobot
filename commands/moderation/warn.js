const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user. (;warn @User being a jerk)',
            examples: [';warn @User being a jerk.'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to warn?',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string',
                validate: reason => {
                    if (reason.length < 141) {
                        return true;
                    }
                    return 'Please keep your reason under 140 characters.';
                }
            }]
        });
    }
    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const member = args.member;
        const reason = args.reason;
        if (!message.guild.channels.exists('name', 'mod_logs')) return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        try {
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                .setColor(0xFFFF00)
                .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                .setTimestamp()
                .setDescription(`**Member:** ${member.user.username}#${member.user.discriminator} (${member.id})\n**Action:** Warn\n**Reason:** ${reason}`);
            return message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
