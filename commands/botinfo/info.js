const commando = require('discord.js-commando');
const Discord = require('discord.js');
const config = require("../../config.json");

class InfoCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'info', 
            group: 'botinfo',
            memberName: 'info',
            description: 'Gives some bot info. (;info)',
            examples: [';info']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        const toHHMMSS = seconds => {
            let secNum = parseInt(seconds, 10);
            let hours = Math.floor(secNum / 3600);
            let minutes = Math.floor((secNum - (hours * 3600)) / 60);
            seconds = secNum - (hours * 3600) - (minutes * 60);   
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;
            return hours + ":" + minutes + ":" + seconds;
        };
        const embed = new Discord.RichEmbed()
        .setTitle('Welcome to XiaoBot!')
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setColor(0x00AE86)
        .setDescription('XiaoBot is your personal companion for your Discord Server!')
        .setFooter('©2017 dragonfire535', this.client.user.avatarURL)
        .setThumbnail(this.client.user.avatarURL)
        .setURL('http://dragonfire535.tk')
        .addField('Commands',
        "There are a variety of commands XiaoBot can use! Use ';help' to view a list of all commands!")
        .addField('Servers',
        this.client.guilds.size, true)
        .addField('Users',
        this.client.users.size, true)
        .addField('Commands',
        config.commandcount, true)
        .addField('Owner',
        "dragonfire535#8081", true)
        .addField('Uptime',
        toHHMMSS(process.uptime()), true)
        .addField('Node Version',
        "7.6.0", true)
        .addField('Host',
        "[Heroku](https://www.heroku.com/)", true)
        .addField('Source Code',
        "[View Here](https://github.com/dragonfire535/xiaobot)", true)
        .addField('Lib', 
        "[discord.js](https://discord.js.org/#/) (master)", true)
        .addField('Packages',
        "[Commando](https://github.com/Gawdl3y/discord.js-commando) (0.9.0), [cleverbot-node](https://github.com/fojas/cleverbot-node) (0.3.3), [pirate-speak](https://github.com/mikewesthad/pirate-speak) (1.0.1), [JIMP](https://github.com/oliver-moran/jimp) (0.2.27), [google-translate-api](https://github.com/matheuss/google-translate-api) (2.2.2), [urban](https://github.com/mvrilo/urban) (0.3.1)")
        .addField('Other Credit',
        "[Cleverbot API](https://www.cleverbot.com/api/)")
        .addField('My Server',
        "[Click Here to Join!](https://discord.gg/fqQF8mc)")
        .addField('Invite Link:',
        "[Click Here to Add Me to Your Server!](https://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=519238)");
        message.channel.sendEmbed(embed).catch(console.error);
    }
}
 
module.exports = InfoCommand;