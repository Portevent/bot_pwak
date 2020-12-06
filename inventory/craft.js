const Item = require('./item');

class Craft {

    static recipes = this.require();

    static require(){
        delete require.cache[require.resolve("./craft.json")];
        return require("./craft.json");
    }

    static load(){
        this.recipes = this.require();
    }

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
            if(count === 0){
                canCraft = false;
                instructions += '🔸';
            }else if(count < instruction[1]){
                canCraft = false;
                instructions += '🔸';
            }else{
                instructions += '🔹';
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
}

module.exports = Craft