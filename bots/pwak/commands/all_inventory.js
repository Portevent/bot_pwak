// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'all_inventory',
    description: {
        "fr": "Affiche tous les inventaires",
        "en": "Show all inventory"
    },
    admin: true,
    async execute(message, args) {
        for(let userId of message.client.inventory.inventory.keys()){
            message.client.users.fetch(userId).then(user => message.client.sendInventory(user, message.author.dmChannel, true, true));
        }
    }
};