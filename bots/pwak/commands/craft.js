// noinspection JSUnusedLocalSymbols
const Craft = require('../../../inventory/craft.js');
// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'craft',
    description: {
        "fr": "Affiche la liste des recettes",
        "en": "Show craft recipes"
    },
    cooldown: 2,
    delete: true,
    execute(message, args) {
        const language = message.client.getLanguage(message.channel);

        const recipes = Craft.getRecipeFor(message.client.inventory, message.author.id);


        if(recipes.length < 1) {
            message.author.send({
                "fr": "Je n'ai plus rien à te proposer",
                "en": "I have nothing more for you"
            }[language]);
        }

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