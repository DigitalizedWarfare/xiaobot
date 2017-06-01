const Command = require('../../structures/Command');
const roasts = require('../../assets/json/roast');

module.exports = class RoastCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roast',
            group: 'response',
            memberName: 'roast',
            description: 'Roasts a user.',
            args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to roast?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const user = args.user || msg.author;
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        return msg.say(`${user}, ${roast}`);
    }
};
