// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'inventory_elite',
    description: {
        "fr": "Affiche tous les inventaires des élites",
        "en": "Show all inventory of best players"
    },
    admin: true,
    async execute(message, args) {
        for(let userId of message.client.inventory.inventory.keys()){
            if(message.client.inventory.userHasItem(userId, "soufle")){
                message.client.users.fetch(userId).then(user => message.client.sendInventory(user, message.author.dmChannel, true, true));
            }
        }
    }
};