const Loot = require('../../../inventory/loot.js');
module.exports = {
    name: 'loot',
    description: {
        "fr": "Génère un loot",
        "en": "Generate a loot"
    },
    admin: true,
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

        let loot = Loot.getLoot(bonus, bonus);

        for(let user of users.values()){
            message.client.inventory.addItemToUser(user.id, loot.item.id, loot.quantity);
        }

        return loot;

    },
};