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
            if(name === drop.title){
                return drop;
            }
        }

        return {}
    }
}
module.exports = Drop