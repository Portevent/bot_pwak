// noinspection SpellCheckingInspection,JSUnusedLocalSymbols
module.exports = {
    name: 'off',
    aliases: ['stop'],
    description: 'Desactive l\'auto talker',
    guildOnly: true,
    execute(message, args) {
        message.client.stop = true;
        // noinspection JSIgnoredPromiseFromCall
        message.client.user.setStatus('invisible');
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};