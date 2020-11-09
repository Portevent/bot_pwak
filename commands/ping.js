module.exports = {
    name: 'ping',
    aliases: ['p', 'pong'],
    description: 'Ping!',
    execute(message, args) {
        message.channel.send('Pong.');
    },
};