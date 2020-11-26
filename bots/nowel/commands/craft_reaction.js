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
        const language = messageReaction.message.client.getLanguage(user);

        const bonusItem = Craft.craft(Craft.getRecipeFromName(messageReaction.message.embeds[0].title), messageReaction.message.client.inventory, user);

        let embed = messageReaction.message.embeds[0];

        embed.description = {
            "fr": "Bonus de fabrication ",
            "en": "Craft bonus"
        }[language] + ": + " + bonusItem.quantity + ' ' + bonusItem.emoji + ' ' + bonusItem.name[language] + "\n" + bonusItem.text[language];

        // noinspection ES6MissingAwait
        messageReaction.message.edit("", {
            embed: embed,
        });

        if(bonusItem.craftMessage){
            user.send(bonusItem.craftMessage[language]);
        }

    },
};