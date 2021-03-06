const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SteamNowPlayingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-now-playing',
			aliases: ['now-playing'],
			group: 'avatar-edit',
			memberName: 'steam-now-playing',
			description: 'Draws a user\'s avatar and the game of your choice over a Steam "now playing" notification.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'game',
					prompt: 'Which game would you like the user to be playing?',
					type: 'string'
				},
				{
					key: 'member',
					prompt: 'Which user would you like to be playing the game?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		let { game } = args;
		const member = args.member || msg.member;
		const avatarURL = member.user.displayAvatarURL({
			format: 'png',
			size: 128
		});
		try {
			const canvas = createCanvas(239, 73);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-now-playing.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 21, 21, 32, 32);
			ctx.fillStyle = '#90ba3c';
			ctx.font = '10px Noto';
			ctx.fillText(member.displayName, 63, 26);
			let shorten;
			if (ctx.measureText(game).width > 160) shorten = true;
			while (ctx.measureText(game).width > 160) game = game.substr(0, game.length - 1);
			ctx.fillText(shorten ? `${game}...` : game, 63, 54);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'steam-now-playing.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
