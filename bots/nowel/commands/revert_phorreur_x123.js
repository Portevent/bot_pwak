// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'revert_phorreur_x123',
    description: {
        "fr": "Fonctions spéciale, ne surtout pas utiliser",
        "en": "Do not use"
    },
    admin: true,
    secret: true,
    args: 1,
    usage: '<max>',
    execute(message, args) {

        for(let user of message.client.inventory.inventory.keys()){
            if(message.client.inventory.userHasItem(user, 'quete1')){
                message.client.inventory.setItemToUser(user, 'nowalmanax_star',  Number(args[0]));
                message.client.inventory.setItemToUser(user, 'quete1',  0);
                message.client.inventory.addItemToUser(user, 'kamas_or',  -1);
            }
        }
        message.react('👍');

    },
};