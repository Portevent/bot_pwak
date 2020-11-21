// noinspection JSUnusedLocalSymbols
const Drop = require("../../inventory/drop.js");
// noinspection JSUnusedLocalSymbols
module.exports = {
    setup(client) {
        client.stop = false;
    },

    onNullCommand(message){
        message.client.execute("reply", message, {});
    },
    onInvalidCommand(message, args, commandName){
        message.client.execute("reply", message, args);
    },
    onWebhook(message){
        if(Drop.getByName(message.author.username) !== {}){
            // noinspection JSIgnoredPromiseFromCall
            message.react('🎁');
        }
    },

    prefix: "all",
};