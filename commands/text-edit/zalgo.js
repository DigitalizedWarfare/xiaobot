const Command = require('../../structures/Command');
const zalgo = require('zalgolize');

module.exports = class ZalgoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'zalgo',
			group: 'text-edit',
			memberName: 'zalgo',
			description: 'Converts text to Zalgo.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to zalgo?',
					type: 'string',
					validate: text => {
						if (text.length < 500) return true;
						return 'Text must be under 500 characters.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(zalgo(text));
	}
};
