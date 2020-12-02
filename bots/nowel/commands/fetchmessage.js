module.exports = {
    name: 'fetchmessage',
    aliases: ['fetchm'],
    description: {
        "fr": "Fetch un message",
        "en": "Fetch a message"
    },
    admin: true,
    delete: true,
    args: 1,
    execute(message, args) {
        message.channel.messages.fetch(args[0]);
    },
};