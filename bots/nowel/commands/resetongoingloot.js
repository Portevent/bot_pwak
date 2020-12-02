module.exports = {
    name: 'resetongoingloot',
    description: {
        "fr": "Reset un loot en cours (debug purpose)",
        "en": "Reset ongoing loot (debug purpose)"
    },
    admin: true,
    args: 1,
    delete: true,
    async execute(message, args) {
        message.client.onGoingLoot.delete(args[0]);
    },
};