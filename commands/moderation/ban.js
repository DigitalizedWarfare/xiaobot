const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['banne'],
            group: 'moderation',
            memberName: 'ban',
            description: 'Bans a user and logs the ban to the mod logs.',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            allowStaff: true,
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to ban?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to set the reason as?',
                    type: 'string',
                    validate: reason => {
                        if (reason.length < 140) return true;
                        return 'Invalid Reason. Reason must be under 140 characters.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlogs) return msg.say('This Command requires a channel set with the `mod-channel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES'))
            return msg.say('This Command requires the `SEND_MESSAGES` Permission for the Mod Log Channel.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `EMBED_LINKS` Permission for the Mod Log Channel.');
        const { member, reason } = args;
        if (!member.bannable) return msg.say('This member is not bannable. Perhaps they have a higher role than me?');
        try {
            try {
                await member.user.send(stripIndents`
                    You were banned from ${msg.guild.name}!
                    Reason: ${reason}.
                `);
            } catch (err) {
                await msg.say('Failed to Send DM.');
            }
            await member.ban({ days: 7, reason });
            msg.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(0xFF0000)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.user.tag} (${member.id})
                    **Action:** Ban
                    **Reason:** ${reason}
                `);
            modlogs.send({ embed });
            return null;
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
