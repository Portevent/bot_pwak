// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_prev',
    description: {
        "fr": "Recule le Nowalmanax d\'un jour",
        "en": "Nowalamanax, one day back"
    },
    admin: true,
    deleteAfter: 5000,
    execute(message, args) {
        message.client.nowalmanax.revert();
    },
};