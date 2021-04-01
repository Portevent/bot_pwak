class Drop {
    static drops = this.require();

    static require(){
        delete require.cache[require.resolve("./drop.json")];
        return require('./drop.json').drops;
    }

    static load(){
        this.drops = this.require();
    }

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
        return "https://cdn.discordapp.com/attachments/787442887800782891/827112716409765888/Paquet_Cadeau_en_Chocolat.png";
    }

    static getByName(name){
        for(let drop of this.drops){
            for (let drop_title of Object.values(drop.title)){
                if(drop_title === name){
                    return drop;
                }
            }
        }

        return undefined;
    }
}
module.exports = Drop