module.exports = {
    name: 'end',
    description: {
        "fr": "Termine l'event",
        "en": "End the event"
    },
    admin: true,
    async execute(message, args) {
        await message.client.end(message.client.announces["fr"], message.client.announces["en"]);
        message.react('👍');
    },
};