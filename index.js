const { CommandoClient } = require('discord.js-commando');
const { carbon, discordBots } = require('./poststats');
const path = require('path');
const client = new CommandoClient({
    commandPrefix: 'x;',
    owner: '242699360352206850',
    disableEveryone: true,
    invite: 'https://discord.gg/fqQF8mc'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['userinfo', 'User Info'],
        ['guildinfo', 'Server Info'],
        ['moderation', 'Moderation'],
        ['response', 'Random Response'],
        ['randomimg', 'Random Image'],
        ['avataredit', 'Avatar Manipulation'],
        ['textedit', 'Text Manipulation'],
        ['imageedit', 'Image Manipulation'],
        ['search', 'Search'],
        ['games', 'Games'],
        ['random', 'Random/Other'],
        ['roleplay', 'Roleplay']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.find('name', 'member_logs');
    if (!channel) return;
    if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    channel.send(`Welcome ${member.user.username}!`);
});

client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.find('name', 'member_logs');
    if (!channel) return;
    if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    channel.send(`Bye ${member.user.username}...`);
});

client.on('guildCreate', async(guild) => {
    console.log(`[Guild] I have joined ${guild.name}! (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    try {
        await carbon(count);
        console.log(`[Carbon] Successfully posted to Carbon.`);
    } catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        await discordBots(count, client.user.id);
        console.log(`[Discord Bots] Successfully posted to Discord Bots.`);
    } catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('guildDelete', async(guild) => {
    console.log(`[Guild] I have left ${guild.name}... (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    console.log(`[Count] ${count}`);
    try {
        await carbon(count);
        console.log(`[Carbon] Successfully posted to Carbon.`);
    } catch (err) {
        console.log(`[Carbon] Failed to post to Carbon. ${err}`);
    }
    try {
        await discordBots(count, client.user.id);
        console.log(`[Discord Bots] Successfully posted to Discord Bots.`);
    } catch (err) {
        console.log(`[Discord Bots] Failed to post to Discord Bots. ${err}`);
    }
});

client.on('disconnect', (event) => {
    console.log(`[Disconnect] Shard ${client.shard.id} disconnected with Code ${event.code}.`);
    process.exit(0);
});

client.setTimeout(() => {
    console.log(`[Restart] Shard ${client.shard.id} Restarted.`);
    process.exit(0);
}, 14400000);

client.on('ready', () => {
    console.log(`[Ready] Shard ${client.shard.id} Logged in!`);
    client.user.setGame(`x;help | Shard ${client.shard.id}`);
});

process.on('unhandledRejection', console.error);

client.login(process.env.TOKEN);
