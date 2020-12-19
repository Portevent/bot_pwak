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
        if(Drop.getByName(message.author.username) !== undefined && !message.client.stop){
            // noinspection JSIgnoredPromiseFromCall
            message.react('🎁');
        }
        if(message.author.username == "Invocation de Craqueleur de Glace"
            || message.author.username == "Summoning of  Ice Crackler") {
            // noinspection JSIgnoredPromiseFromCall
            message.react('❄').catch(e => this.logError(e));
        }
    },

    prefix: "all",
};