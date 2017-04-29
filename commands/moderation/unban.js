const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: [
                'unbanne'
            ],
            group: 'moderation',
            memberName: 'unban',
            description: 'Unbans a user and logs the unban to the mod_logs.',
            guildOnly: true,
            args: [{
                key: 'id',
                prompt: 'What member do you want to unban? Please enter the ID of the user.',
                type: 'string',
                validate: id => {
                    if (id.length === 18)
                        return true;
                    return `${id} is not a valid ID. Please enter the user you wish to unban's ID.`;
                }
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string',
                validate: reason => {
                    if (reason.length < 140)
                        return true;
                    return `Please keep your reason under 140 characters, you have ${reason.length}.`;
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.permissions.has('BAN_MEMBERS');
    }

    async run(message, args) {
        if (!message.channel.permissionsFor(this.client.user).has('BAN_MEMBERS'))
            return message.say('This Command requires the `Ban Members` Permission.');
        const modlogs = message.guild.channels.find('name', message.guild.settings.get('modLog', 'mod_logs'));
        if (!modlogs)
            return message.say('This Command requires a channel named `mod_logs` or one custom set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return message.say('This Command requires the `Embed Links` Permission.');
        const { id, reason } = args;
        const bans = await message.guild.fetchBans();
        if (!bans.has(id))
            return message.say('This ID is not in the Guild Banlist.');
        const member = await bans.get(id);
        try {
            await message.guild.unban(member);
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .setDescription(`**Member:** ${member.tag} (${member.id})\n**Action:** Unban\n**Reason:** ${reason}`);
            return modlogs.send({embed});
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
