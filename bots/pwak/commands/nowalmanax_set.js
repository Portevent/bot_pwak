// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_set',
    aliases: ['ns'],
    description: {
        "fr": "Définis le nowalamanax à un jour précis",
        "en": "Set Kwismalmanax to a specific day"
    },
    args: 1,
    admin: true,
    delete: true,
    execute(message, args) {
        message.client.nowalmanax.reset(Number(args[0]));
        message.reply('Day set to ' + message.client.nowalmanax.day);
    },
};