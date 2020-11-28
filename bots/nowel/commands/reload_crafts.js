// noinspection JSUnusedLocalSymbols
const Craft = require('../../../inventory/craft.js');

module.exports = {
    name: 'reload_crafts',
    description: {
        "fr": "Recharge la classe Craft (pour debugger)",
        "en": "Reload Craft (debug purpose)"
    },
    admin: true,
    execute(message, args) {
        Craft.load();
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};