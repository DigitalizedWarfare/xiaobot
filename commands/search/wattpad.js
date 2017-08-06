const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');
const { wattpadKey } = require('../../config');

module.exports = class WattpadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wattpad',
			group: 'search',
			memberName: 'wattpad',
			description: 'Searches Wattpad for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What book would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		const { body } = await snekfetch
			.get('https://api.wattpad.com:443/v4/stories')
			.query({
				query,
				limit: 1
			})
			.set({ Authorization: `Basic ${wattpadKey}` });
		if (!body.stories.length) return msg.say('No Results.');
		const embed = new MessageEmbed()
			.setColor(0xF89C34)
			.setAuthor('Wattpad', 'https://i.imgur.com/Rw9vRQB.png')
			.setURL(body.stories[0].url)
			.setTitle(body.stories[0].title)
			.setDescription(body.stories[0].description.substr(0, 2048))
			.setThumbnail(body.stories[0].cover)
			.addField('❯ Created On',
				moment(body.stories[0].createDate).format('MMMM Do YYYY'), true)
			.addField('❯ Author',
				body.stories[0].user, true)
			.addField('❯ Parts',
				body.stories[0].numParts, true)
			.addField('❯ Reads',
				body.stories[0].readCount, true)
			.addField('❯ Votes',
				body.stories[0].voteCount, true)
			.addField('❯ Comments',
				body.stories[0].commentCount, true);
		return msg.embed(embed);
	}
};
