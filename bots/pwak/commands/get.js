// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'get',
    description: {
        "fr": "Affiche l'objet dans l'inventaire",
        "en": "Display an item"
    },
    admin: true,
    args: 1,
    usage: '<item> <?userId>',
    deleteAfter: 5000,
    execute(message, args) {

        if(Item.exists(args[0])){
            // noinspection JSIgnoredPromiseFromCall
            message.reply(message.client.inventory.getTrueItemOfUser((args.length > 1?args[1]:message.author.id), args[0]));
        }

        else{
            return message.reply('Objet inexistant');
        }

    },
};