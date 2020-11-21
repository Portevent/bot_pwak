module.exports = {
    name: 'react',
    aliases: [],
    description: 'Réagis à un message avec 🎁',
    guildOnly: true,
    execute(message, args) {
        message.channel.messages.fetch(args[0])
            .then(message => message.react('🎁'));
    },
};