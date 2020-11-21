const Item = require('./item.js');

class Loot {
    static loots = require('./loot.json');

    static getMetaLoot(bonus = 1){
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

    static getLoot(quality_bonus){
        const meta_loot = this.getMetaLoot(quality_bonus);
        const items = Object.keys(meta_loot.items);
        const item = items[Math.floor(Math.random() * items.length)]

        return {"meta_loot": meta_loot, "item": Item.get(item), "quantity": meta_loot.items[item]};
    }
}
module.exports = Loot