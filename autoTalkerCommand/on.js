module.exports = {
    name: 'on',
    aliases: ['start'],
    description: 'Active l\'auto talker',
    guildOnly: true,
    execute(message, args) {
        message.client.stop = false;
        message.client.user.setStatus('online');
        message.react('👍');
    },
};