// noinspection SpellCheckingInspection
module.exports = {
    name: 'load_behavior',
    description: {
        'fr': 'Charge le fichier behavior (fonction de debug)',
        'en': 'Load the behavior file (debug purpose)'
    },
    deleteAfter: 5000,
    admin: true,
    execute(message, args) {
        // Upgrading to new behaviors
        delete require.cache[require.resolve('../behavior.js')];
        const bot_behaviors = require('../behavior.js');
        for(let behavior in bot_behaviors) {
            // noinspection JSUnfilteredForInLoop
            message.client[behavior] = bot_behaviors[behavior];
        }
        message.react('👍');
    },
};