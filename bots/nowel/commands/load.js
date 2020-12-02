module.exports = {
    name: 'load',
    description: {
        "fr": "Recharge",
        "en": "Load everything"
    },
    admin: true,
    args: 1,
    execute(message, args) {
        message.client.inventory.import(args[0]);
        message.client.nowalmanax.import(args[0]);
        message.reply("Auto loaded : " + args[0]);
    },
};