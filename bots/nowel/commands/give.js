// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'give',
    description: 'Give any item',
    adminOnly: true,
    args: 1,
    usage: '<item> <count = 1>',
    deleteAfter: 5000,
    execute(message, args) {

        if(Item.exists(args[0])){
            message.client.inventory.addItemToUser(message.author.id, args[0], ((args.length > 1)?args[1]:1));
            message.react('👍');
        }

        else{
            return message.reply('Objet inexistant');
        }

    },
};