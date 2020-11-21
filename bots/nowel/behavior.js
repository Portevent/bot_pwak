const Inventory = require("../../inventory/inventory.js");
const Drop = require("../../inventory/drop.js");
const webhook_template = require("../../webhook_template.json");

// noinspection JSUnusedLocalSymbols
module.exports = {
    setup(client) {
        client.inventory = new Inventory();
        client.drop_params = require('../../inventory/drop.json');
        client.items = require('../../inventory/items.json');
        client.onGoingLoot = new Map();

        client.messageSinceLastDrop = 0;
    },

    onReaction(reaction, user){
        if(reaction.message.webhookID){
            if(reaction.emoji.name === '🎁'){
                const drop = Drop.getByName(reaction.message.author.username);

                reaction.users.fetch().then(users => {
                    if(users.size >= drop.min){
                        if(reaction.message.client.onGoingLoot.has(reaction.message.id)){
                            return;
                        }
                        // noinspection JSIgnoredPromiseFromCall
                        reaction.message.react('🥁');
                        let timer = setTimeout(() => {
                            reaction.message.client.execute('loot_reaction', reaction);
                        }, 5*1000);
                        reaction.message.client.onGoingLoot.set(reaction.message.id, timer);
                    }

                    if(users.size >= drop.max){
                        if(reaction.message.client.onGoingLoot.has(reaction.message.id)) {
                            clearTimeout(reaction.message.client.onGoingLoot.get(reaction.message.id));
                        }
                        reaction.message.client.execute('loot_reaction', reaction);
                    }
                })
            }
        }
    },

    onUserMessage(message){
        message.client.execute('attemptDrop', message, []);
    },

    onWebhook(message){
        if(message.author.username === 'Un Cadeau Apparait !') {
            // noinspection JSIgnoredPromiseFromCall
            message.react('🎁');
        }
        if(message.author.username === 'Un Gros Cadeau Apparait !'){
            // noinspection JSIgnoredPromiseFromCall
            message.react('🎁');
        }
        if(message.author.username === 'Il neige !'){
            // noinspection JSIgnoredPromiseFromCall
            message.react('⛄');
            setTimeout(() => {
                message.client.editWebhook(message.channel, webhook_template.small_snowmen, message.id);
            }, 60*1000);
        }
    }
};