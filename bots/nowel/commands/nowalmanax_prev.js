// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_prev',
    aliases: ['np', 'n-'],
    description: {
        "fr": "Recule le Nowalmanax d\'un jour",
        "en": "Nowalamanax, one day back"
    },
    admin: true,
    delete: true,
    execute(message, args) {
        message.client.nowalmanax.revert();
        message.reply('Day set to ' + message.client.nowalmanax.day);
    },
};