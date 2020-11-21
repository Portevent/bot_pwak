module.exports = {
    name: 'ping',
    aliases: ['p', 'pong'],
    description: 'Ping!',
    guildOnly: true,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};