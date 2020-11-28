// noinspection JSUnusedLocalSymbols
const Drop = require('../../../inventory/drop.js');

module.exports = {
    name: 'reload_drops',
    description: {
        "fr": "Recharge la classe Drop (pour debugger)",
        "en": "Reload Drop (debug purpose)"
    },
    admin: true,
    execute(message, args) {
        Drop.load();
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};