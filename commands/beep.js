module.exports = {
    name: 'beep',
    aliases: ['bep', 'bip'],
    description: 'Beep ',
    guildOnly: true,
    execute(message, args) {
        message.channel.send('Boop.');
    },
};