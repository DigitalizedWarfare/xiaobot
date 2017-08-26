const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const statuses = {
	online: '<:online:313956277808005120> Online',
	idle: '<:away:313956277220802560> Idle',
	dnd: '<:dnd:313956276893646850> Do Not Disturb',
	offline: '<:offline:313956277237710868> Offline'
};

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user', 'member', 'member-info'],
			group: 'user-info',
			memberName: 'user',
			description: 'Responds with detailed information on a user.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'member',
					prompt: 'Which user would you like to get information on?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	run(msg, args) {
		const member = args.member || msg.member;
		const embed = new MessageEmbed()
			.setColor(member.displayHexColor)
			.setThumbnail(member.user.displayAvatarURL())
			.addField('❯ Name',
				member.user.tag, true)
			.addField('❯ ID',
				member.id, true)
			.addField('❯ Discord Join Date',
				moment(member.user.createdAt).format('MMMM Do YYYY'), true)
			.addField('❯ Server Join Date',
				moment(member.joinedTimestamp).format('MMMM Do YYYY'), true)
			.addField('❯ Status',
				statuses[member.presence.status], true)
			.addField('❯ Playing',
				member.presence.game ? member.presence.game.name : 'N/A', true)
			.addField('❯ Highest Role',
				member.highestRole.name !== '@everyone' ? member.highestRole.name : 'None', true)
			.addField('❯ Hoist Role',
				member.hoistRole ? member.hoistRole.name : 'None', true);
		return msg.embed(embed);
	}
};
