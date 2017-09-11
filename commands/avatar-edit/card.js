const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');
const { version } = require('../../package');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class CardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'card',
			aliases: ['discord-card'],
			group: 'avatar-edit',
			memberName: 'card',
			description: 'Creates a trading card of random rarity based on a user\'s profile.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'member',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const member = args.member || msg.member;
		const avatarURL = member.user.displayAvatarURL({
			format: 'png',
			size: 256
		});
		try {
			const cardID = Math.floor(Math.random() * ((9999 - 1000) + 1)) + 1000;
			let rarity;
			if (cardID < 5000) rarity = 'C';
			else if (cardID < 8000) rarity = 'U';
			else rarity = 'R';
			const canvas = createCanvas(390, 544);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'card.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 390, 544);
			ctx.drawImage(avatar, 11, 11, 370, 370);
			ctx.drawImage(base, 0, 0);
			ctx.font = '18px Noto';
			ctx.fillStyle = 'black';
			ctx.fillText(member.displayName, 30, 62);
			ctx.fillText('Discord Join Date:', 148, 400);
			ctx.fillText(member.user.createdAt.toDateString(), 148, 420);
			ctx.fillText('Role:', 148, 457);
			ctx.fillText(member.highestRole.name !== '@everyone' ? member.highestRole.name : 'None', 148, 477);
			ctx.fillText(rarity, 73, 411);
			ctx.fillText(cardID, 60, 457);
			ctx.fillText(version.split('.')[0], 68, 502);
			ctx.font = '14px Noto';
			ctx.fillText(member.id, 30, 355);
			ctx.fillText(`#${member.user.discriminator}`, 313, 355);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'card.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
