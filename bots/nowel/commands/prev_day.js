// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'prev_day',
    description: 'Recule le Nowalmanax d\'un jour',
    execute(message, args) {
        message.client.nowalmanax.revert();
    },
};