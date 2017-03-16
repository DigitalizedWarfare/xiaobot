const commando = require('discord.js-commando');
const Discord = require('discord.js');

class TypingGameCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'typinggame', 
            group: 'random',
            memberName: 'typinggame',
            description: 'See how fast you can type a sentence in a given time limit. (;typinggame easy)',
            examples: [';typinggame easy', ';typinggame medium', ';typinggame hard', ';typinggame extreme']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let [level] = message.content.toLowerCase().split(" ").slice(1);
        let randomSentence = ['The quick brown fox jumps over the lazy dog.', 'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo.', 'How razorback-jumping frogs can level six piqued gymnasts!', 'Amazingly few discotheques provide jukeboxes.'];
        randomSentence = randomSentence[Math.floor(Math.random() * randomSentence.length)];
        let time;
        switch (level) {
            case "easy":
            time = 25000;
            break;
            case "medium":
            time = 20000;
            break;
            case "hard":
            time = 15000;
            break;
            case "extreme": 
            time = 10000;
            break;
        }
        let levelWord;
        switch (level) {
            case "easy":
            levelWord = "twenty-five";
            break;
            case "medium":
            levelWord = "twenty";
            break;
            case "hard":
            levelWord = "fifteen";
            break;
            case "extreme": 
            levelWord = "ten";
            break;
        }
        if(time === undefined) {
            message.channel.send(':x: Error! No difficulty set! (Choose Easy, Medium, Hard, or Extreme)');
        } else {
            const embed = new Discord.RichEmbed()
            .setTitle('You have **' + levelWord + '** seconds to type:')
            .setDescription(randomSentence);
            message.channel.sendEmbed(embed).then(() => {
                message.channel.awaitMessages(response => response.content === randomSentence && response.author.id === message.author.id, {
                    max: 1,
                    time: time,
                    errors: ['time'],
                }).then((collected) => {
                    message.channel.send(`Good Job! You won!`);
                }).catch(() => {
                    message.channel.send('Aw... Too bad, try again next time!');
                });
            });
        }
    }
}

module.exports = TypingGameCommand;