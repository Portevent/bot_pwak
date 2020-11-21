const Loot = require('../../../inventory/loot.js');
module.exports = {
    name: 'loot',
    aliases: ['loot'],
    description: 'Génère un loot',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    cooldown: 0.1,
    async execute(message, args) {
        let bonus = 1
        let users = new Map();
        users.set(message.author.id, message.author);

        if(args && args.length && args.length > 0){
            bonus = args[0]
        }
        if(args && args.length && args.length > 1){
            users = args[1];
        }

        let loot = Loot.getLoot(bonus);

        if(loot.quantity !== -1){
            loot.quantity *= 1 + Math.random()/2;
            loot.quantity *= bonus;
            loot.quantity = Math.ceil(loot.quantity);
        }else{
            loot.quantity = 1;
        }

        for(let user of users.values()){
            message.client.inventory.addItemToUser(user.id, loot.item.id, loot.quantity);
        }

        return loot;

    },
};