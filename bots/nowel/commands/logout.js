// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'logout',
    description: {
        "fr": "Deconnecte le bot",
        "en": "Log out the bot"
    },
    secret: true,
    admin: true,
    execute(message, user) {
        message.client.destroy();
    }
};