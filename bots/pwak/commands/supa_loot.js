const Loot = require("../../../inventory/loot.js");

// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'supa_loot',
    aliases: ['l+', 'sloot'],
    description: {
        "fr": "Loot 10 fois !",
        "en": "Loot 10 times !"
    },
    secret: true,
    admin: true,
    async execute(message, args) {
        const language = message.client.getLanguage(message.channel);

        let text = "";

        for (let i = 0; i < 10; i++) {
            let loot = Loot.getLoot();
            message.client.inventory.addItemToUser(message.author.id, loot.item.id, loot.quantity);
            text += loot.item.emoji + loot.item.name[language] + " : " + loot.quantity + "\n";
        }

        message.reply(text);

    },
};