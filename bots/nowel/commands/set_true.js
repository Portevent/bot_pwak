// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'set_true',
    description: {
        "fr": "Definis la quantité de l'objet à l'inventaire (non texte)",
        "en": "Set any inventory's item to an amount (non texte)"
    },
    admin: true,
    args: 1,
    usage: '<item> <count = 1> <?userId>',
    deleteAfter: 5000,
    execute(message, args) {

        if(Item.exists(args[0])){
            console.log('Setting true something');
            message.client.inventory.setItemToUser((args.length > 2?args[2]:message.author.id), args[0], (args.length > 1)?args[1]:1);
            console.log('Setting true something 2');
            // noinspection JSIgnoredPromiseFromCall
            message.react('👍');
        }

        else{
            return message.reply('Objet inexistant');
        }

    },
};