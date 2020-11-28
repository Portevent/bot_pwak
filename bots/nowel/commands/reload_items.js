// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'reload_items',
    description: {
        "fr": "Recharge la classe Item (pour debugger)",
        "en": "Reload Item (debug purpose)"
    },
    admin: true,
    execute(message, args) {
        Item.load();
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};