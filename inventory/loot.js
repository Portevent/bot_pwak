const Item = require('./item.js');

class Loot {
    static loots = this.require();

    static require(){
        delete require.cache[require.resolve("./loot.json")];
        return require("./loot.json");
    }

    static load(){
        this.loots = this.require();
    }


    static getRandomMetaLoot(bonus = 1){
        let random = Math.random()/bonus;

        for(let loot of Object.values(this.loots)){
            if(random <= loot.prob){
                return loot;
            }else{
                random -= loot.prob;
            }
        }

        return {}
    }

    static getMetaLoot(metaloot_id){
        return this.loots[metaloot_id];
    }

    static lootFrom(meta_loot, quantity_bonus = 1){
        const loots = Object.keys(meta_loot.loots);
        const loot = loots[Math.floor(Math.random() * loots.length)]
        let quantity = meta_loot.loots[loot]

        if(quantity !== -1){
            quantity *= 1 + Math.random()/2;
            quantity *= quantity_bonus;
            quantity = Math.ceil(quantity);
        }

        else{
            quantity = 1;
        }

        return {"meta_loot": meta_loot, "item": Item.get(loot), "quantity": quantity};
    }

    static getLoot(quality_bonus = 1, quantity_bonus = 1){
        return this.lootFrom(this.getRandomMetaLoot(quality_bonus), quantity_bonus);
    }

    static getLootFromMetaLoot(metaloot_id, quantity_bonus = 1){
        return this.lootFrom(this.getMetaLoot(metaloot_id), quantity_bonus);
    }
}
module.exports = Loot