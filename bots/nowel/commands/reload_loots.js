// noinspection JSUnusedLocalSymbols
const Loot = require('../../../inventory/loot.js');

module.exports = {
    name: 'reload_loots',
    description: {
        "fr": "Recharge la classe Loot (pour debugger)",
        "en": "Reload Loot (debug purpose)"
    },
    admin: true,
    execute(message, args) {
        Loot.load();
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};