const Command = require('../../structures/Command');
const { stripIndent } = require('common-tags');

module.exports = class CowsayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cow-say',
			group: 'text-edit',
			memberName: 'cow-say',
			description: 'Converts text to cow-say.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the cow to say?',
					type: 'string',
					validate: text => {
						if (text.length < 1500) return true;
						return 'Invalid text, please keep the text under 1500 characters.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.code(null,
			stripIndent`
				< ${text} >
				   \\   ^__^
					\\  (oO)\\_______
					   (__)\\       )\\/\\
						 U  ||----w |
							||     ||
			`
		);
	}
};
