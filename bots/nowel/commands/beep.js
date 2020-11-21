// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'beep',
    aliases: ['bep', 'bip'],
    description: 'Beep ',
    dmOnly: true,
    execute(message, args) {
        message.channel.send('Boop.');
    },
};