module.exports = {
    name: 'off',
    aliases: ['stop'],
    description: 'Desactive l\'auto talker',
    guildOnly: true,
    execute(message, args) {
        message.client.stop = true;
        message.client.user.setStatus('invisible');
        message.react('👍');
    },
};