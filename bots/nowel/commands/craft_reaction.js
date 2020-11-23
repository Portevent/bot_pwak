// noinspection JSUnusedLocalSymbols
const Loot = require('../../../inventory/loot.js');
const Item = require('../../../inventory/item.js');
const Craft = require('../../../inventory/craft.js');
module.exports = {
    name: 'craft_reaction',
    description: 'Fabrique l\'item du message ciblé (non utilisable manuellement)',
    secret: true,
    locked: true,
    async execute(messageReaction, user) {

        const bonusItem = Craft.craft(Craft.getRecipeFromName(messageReaction.message.embeds[0].title), messageReaction.message.client.inventory, user);

        let embed = messageReaction.message.embeds[0];

        embed.description = "Bonus de craft : + " + bonusItem.quantity + ' ' + bonusItem.emoji + ' ' + bonusItem.name;

        messageReaction.message.edit("", {
            embed: embed,
        });

    },
};