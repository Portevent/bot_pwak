// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'reset',
    description: 'Reset le Nowalmanax à un jour précis',
    execute(message, args) {
        message.client.nowalmanax.reset(args[0]);
    },
};