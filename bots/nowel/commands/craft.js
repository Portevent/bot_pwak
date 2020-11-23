// noinspection JSUnusedLocalSymbols
const Craft = require('../../../inventory/craft.js');
module.exports = {
    name: 'craft',
    description: 'Affiche la liste des recettes',
    execute(message, args) {
        const recipes = Craft.getRecipeFor(message.client.inventory, message.author.id);
        for(recipe of recipes){
            let embed = Craft.recipeToEmbed(recipe, message.client.inventory, message.author.id);
            message.reply('',{
                embed: embed,
            }).then(n_message => {
                if(embed.canCraft){
                    n_message.react('🛠️');
                }
            })
        }
    },
};