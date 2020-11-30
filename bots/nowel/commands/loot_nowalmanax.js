// noinspection JSUnusedLocalSymbols
const Loot = require('../../../inventory/loot.js');
const Item = require('../../../inventory/item.js');
module.exports = {
    name: 'loot_nowalmanax',
    description: {
        "fr": "",
        "en": ""
    },
    secret: true,
    locked: true,
    async execute(messageReaction, user) {
        const language = messageReaction.message.client.getLanguage(messageReaction.message.channel);

        let advancement = messageReaction.message.client.inventory.getItemOfUser(user.id, messageReaction.message.client.nowalmanax.questItem);

        let embed = messageReaction.message.embeds[0];

        let loot = {"item": Item.get(messageReaction.message.client.nowalmanax.questItem), "quantity": 1};
        let loot1 = Loot.getLootFromMetaLoot("common", 2);
        let loot2 = Loot.getLootFromMetaLoot("common", 2);
        let loot3 = Loot.getLootFromMetaLoot("common", 2);


        messageReaction.message.client.inventory.addItemToUser(user.id, loot.item.id, loot.quantity);
        messageReaction.message.client.inventory.addItemToUser(user.id, loot1.item.id, loot1.quantity);
        messageReaction.message.client.inventory.addItemToUser(user.id, loot2.item.id, loot2.quantity);
        messageReaction.message.client.inventory.addItemToUser(user.id, loot3.item.id, loot3.quantity);


        embed.description = loot.item.emoji + loot.item.name[language] + "\n"
                            + (loot1.quantity>1?loot1.quantity + 'x':'') + loot1.item.emoji + loot1.item.name[language] + "\n"
                            + (loot2.quantity>1?loot2.quantity + 'x':'') + loot2.item.emoji + loot2.item.name[language] + "\n"
                            + (loot3.quantity>1?loot3.quantity + 'x':'') + loot3.item.emoji + loot3.item.name[language]

        // noinspection ES6MissingAwait,JSUnresolvedVariable
        messageReaction.message.edit("", {
            embed: embed,
        });

        if(!messageReaction.client.inventory.userHasItem(user.id, 'nowalmanax_help')){
            messageReaction.client.inventory.addItemToUser(user.id, 'nowalmanax_help');
            user.send({
                'fr': "Super, tu as capturé ton premier phoreur ! Chaque jour il est possible de trouver un phoreur différent. Tu peux voir si tu as déjà attrapé le tiens avec `" + messageReaction.client.prefix + "phoreur`.",
                'en': "Nice, you caught your first drheller ! Each day you can catch a different dhreller. You can check if you found it with `" + messageReaction.client.prefix + "dhreller`.",
            }[language]);
        }
    },
};