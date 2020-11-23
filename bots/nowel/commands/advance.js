// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'advance',
    description: 'Avance le Nowalmanax d\'un jour',
    execute(message, args) {
        message.client.nowalmanax.advance();
    },
};