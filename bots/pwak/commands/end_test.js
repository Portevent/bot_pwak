module.exports = {
    name: 'end_test',
    description: {
        "fr": "Test la fin de l'event",
        "en": "Test the end of the event"
    },
    admin: true,
    async execute(message, args) {
        await message.client.end(message.author, message.author);
        message.client.dropOn = true;
        message.react('👍');
    },
};