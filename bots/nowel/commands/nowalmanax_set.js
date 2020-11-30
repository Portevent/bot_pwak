// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_set',
    description: {
        "fr": "Définis le nowalamanax à un jour précis",
        "en": "Set Kwismalmanax to a specific day"
    },
    args: 1,
    admin: true,
    deleteAfter: 5000,
    execute(message, args) {
        message.client.nowalmanax.reset(args[0]);
    },
};