// noinspection JSUnusedLocalSymbols
const Loot = require('../../../inventory/loot.js');
const Craft = require('../../../inventory/craft.js');
module.exports = {
    name: 'craft_reaction',
    description: {
        "fr": "Fabrique l'item du message ciblé",
        "en": "Craft the item from the targeted message"
    },
    secret: true,
    locked: true,
    async execute(messageReaction, user) {

        const bonusItem = Craft.craft(Craft.getRecipeFromName(messageReaction.message.embeds[0].title), messageReaction.message.client.inventory, user);

        let embed = messageReaction.message.embeds[0];

        embed.description = "Bonus de craft : + " + bonusItem.quantity + ' ' + bonusItem.emoji + ' ' + bonusItem.name;

        // noinspection ES6MissingAwait
        messageReaction.message.edit("", {
            embed: embed,
        });

    },
};