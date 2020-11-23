const fetch = require('node-fetch');
const Item = require('./item');

class Craft {

    static recipes = require("./craft.json");

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
    static recipeToEmbed(recipe){
        const result = Item.get(recipe.result);
        let instructions = "";
        for(let instruction of recipe.recipe){
            const item = Item.get(instruction[0]);
            instructions += instruction[1] + 'x' + item.emoji + item.name + "\n";
        }
        return {
            "title": result.name,
            "description": instructions,
            "thumbnail": {
                "url": result.img
            }
        }
    }

    async postToday() {
        await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify({
                "content": "Pour obtenir Le Cadeau du Jour il faut : \n\n" + this.instructions,
                "username": this.day + " Décembre",
                "avatar_url": this.calendar.images[this.day]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


    loadDay(){
        this.dayQuest = this.calendar[this.day.toString()];
        this.users = new Map();
        this.usersDroppedMention = new Map();
        this.instructions = "";


        for(let condition of this.calendar._conditions){
            if(this.dayQuest[condition]){
                this.instructions += '- **' + this.calendar._instructions[condition].replace('#value#', this.dayQuest[condition]) + '**\n';
            }
        }
    }

    userValidateQuest(channel, user) {
        user.send('Je me demande ce qu\'il contient !', {
            embed: {
                "title": "Cadeau du " + this.day + " Decembre",
                "description": this.instructions,
                "thumbnail": {
                    "url":  this.calendar.images[this.day],
                }
            },
            //files: ['https://cdn.discordapp.com/attachments/770768439773888532/779761054866735124/89045.png']
        }).then(message => {
            message.react('🎁');
        });
        this.users.set(user.id, true);
    }
}

module.exports = Craft