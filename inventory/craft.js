const fetch = require('node-fetch');
const Item = require('./item');

class Craft {

    static recipes = require("./craft.json");

    static getRecipeFromName(name){
        return this.recipes[Item.getFromName(name).id];
    }

    static getRecipeFor(inventory, user){
        let recipes = [];
        for (let recipe of Object.values(this.recipes)) {
            if(!recipe.require || inventory.userHasItem(user, recipe.require)){
                recipes.push(recipe);
            }
        }
        return recipes;
    }

    // noinspection JSUnfilteredForInLoop
    static recipeToEmbed(recipe, inventory, user, language){
        const result = Item.get(recipe.result);
        let canCraft = true;
        let instructions = "";
        for(let instruction of recipe.recipe){
            const item = Item.get(instruction[0]);
            const count = inventory.getItemOfUser(user, item.id);
            if(count == 0){
                canCraft = false;
                instructions += '🟠';
            }else if(count < instruction[1]){
                canCraft = false;
                instructions += '🟡';
            }else{
                instructions += '🟢';
            }
            instructions += instruction[1] + 'x' + item.emoji + item.name[language] + "\n";
        }
        return {
            "canCraft": canCraft,
            "title": result.name[language],
            "description": instructions,
            "thumbnail": {
                "url": result.img
            }
        }
    }

    // noinspection JSUnfilteredForInLoop
    static craft(recipe, inventory, user){
        inventory.addItemToUser(user.id, recipe.result);

        for(let ingredient of recipe.recipe){
            inventory.addItemToUser(user.id, ingredient[0], -ingredient[1]);
        }

        const bonusItem = Item.get(recipe.craftBonus);
        bonusItem.quantity = recipe.craftBonusQuantity;

        inventory.addItemToUser(user.id, bonusItem.id, recipe.craftBonusQuantity);

        if(recipe.craftRemoveFlag){
            inventory.addItemToUser(user.id, recipe.craftRemoveFlag, -1);
        }

        return bonusItem;
    }
}

module.exports = Craft