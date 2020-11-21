// noinspection SpellCheckingInspection,JSUnusedLocalSymbols
module.exports = {
    name: 'on',
    aliases: ['start'],
    description: 'Active l\'auto talker',
    guildOnly: true,
    execute(message, args) {
        message.client.stop = false;
        // noinspection JSIgnoredPromiseFromCall
        message.client.user.setStatus('online');
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};