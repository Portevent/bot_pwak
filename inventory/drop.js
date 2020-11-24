class Drop {
    static drops = require('./drop.json').drops;
    static resources = require('./ressources.json');
    static getDrop(){
        let random = Math.random();

        for(let drop of this.drops){
            if(random <= drop.prob){
                return drop;
            }else{
                random -= drop.prob;
            }
        }

        return {}
    }

    static getGift(){
        return this.resources.gift_images[Math.floor(Math.random() * this.resources.gift_images.length)];
    }

    static getByName(name){
        for(let drop of this.drops){
            for (let drop_title of Object.values(drop.title)){
                if(drop_title === name){
                    return drop;
                }
            }
        }

        return undefined
    }
}
module.exports = Drop