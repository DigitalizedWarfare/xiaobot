const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class BulbapediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bulbapedia',
			aliases: ['bulbagarden'],
			group: 'search',
			memberName: 'bulbapedia',
			description: 'Searches Bulbapedia for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get('https://bulbapedia.bulbagarden.net/w/api.php')
				.query({
					action: 'query',
					prop: 'extracts|pageimages',
					format: 'json',
					titles: query,
					exintro: '',
					explaintext: '',
					pithumbsize: 150,
					redirects: '',
					formatversion: 2
				});
			if (body.query.pages[0].missing) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0x3E7614)
				.setTitle(body.query.pages[0].title)
				.setAuthor('Bulbapedia', 'https://i.imgur.com/09eYo5T.png')
				.setThumbnail(body.query.pages[0].thumbnail ? body.query.pages[0].thumbnail.source : null)
				.setDescription(shorten(body.query.pages[0].extract.replace(/\n/g, '\n\n')));
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
