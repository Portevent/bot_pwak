// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_next',
    aliases: ['nn', 'n+'],
    description: {
        "fr": 'Avance le Nowalmanax d\'un jour',
        "en": 'Advance the Kwismalmanax'
    },
    admin: true,
    delete: true,
    execute(message, args) {
        message.client.nowalmanax.advance();
        message.reply('Day set to ' + message.client.nowalmanax.day);
    },
};