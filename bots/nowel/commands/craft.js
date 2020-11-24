// noinspection JSUnusedLocalSymbols
const Craft = require('../../../inventory/craft.js');
// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'craft',
    description: {
        "fr": "Affiche la liste des recettes",
        "en": "Show craft recipes"
    },
    execute(message, args) {
        const language = message.client.getLanguage(message.channel);

        const recipes = Craft.getRecipeFor(message.client.inventory, message.author.id);

        for(let recipe of recipes){
            let embed = Craft.recipeToEmbed(recipe, message.client.inventory, message.author.id, language);
            message.author.send('',{
                embed: embed,
            }).then(n_message => {
                if(embed.canCraft){
                    // noinspection JSIgnoredPromiseFromCall
                    n_message.react('🛠️');
                }
            })
        }
    },
};