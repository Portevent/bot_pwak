// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_next',
    description: {
        "fr": 'Avance le Nowalmanax d\'un jour',
        "en": 'Advance the Kwismalmanax'
    },
    admin: true,
    deleteAfter: 5000,
    execute(message, args) {
        message.client.nowalmanax.advance();
        message.react('👍');
    },
};