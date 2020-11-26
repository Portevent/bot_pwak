// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'give',
    description: {
        "fr": "Ajoute l'objet à l'inventaire",
        "en": "Give any item"
    },
    admin: true,
    args: 1,
    usage: '<item> <count = 1>',
    deleteAfter: 5000,
    execute(message, args) {

        if(Item.exists(args[0])){
            message.client.inventory.addItemToUser(message.author.id, args[0], Number((args.length > 1)?args[1]:1));
            // noinspection JSIgnoredPromiseFromCall
            message.react('👍');
        }

        else{
            return message.reply('Objet inexistant');
        }

    },
};