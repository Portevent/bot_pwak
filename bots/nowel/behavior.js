const Inventory = require("../../inventory");
const webhook_template = require("../../webhook_template.json");

module.exports = {
    setup(client) {
        client.inventory = new Inventory();
        client.drop_params = require('./../../drop_param.json');
        client.items = require('./../../items.json');
        client.onGoingLoot = new Map();

        client.messageSinceLastDrop = 0;
    },

    onReaction(reaction, user){
        if(reaction.message.webhookID){
            if(reaction.emoji.name === '🎁'){
                let min = 998;
                let max = 999;
                if(reaction.message.author.username === 'Un Cadeau Apparait !') {
                    min = 2;
                    max = 4;
                }
                if(reaction.message.author.username === 'Un Gros Cadeau Apparait !'){
                    min = 4;
                    max = 8;
                }

                reaction.users.fetch().then(users => {
                    console.log(users.size);
                    if(users.size >= min){
                        if(reaction.message.client.onGoingLoot.has(reaction.message.id)){
                            return;
                        }
                        // noinspection JSIgnoredPromiseFromCall
                        reaction.message.react('🥁');
                        let timer = setTimeout(() => {
                            reaction.message.client.execute('loot', reaction);
                        }, 5*1000);
                        reaction.message.client.onGoingLoot.set(reaction.message.id, timer);
                    }

                    if(users.size >= max){
                        console.log("MAX !");
                        if(reaction.message.client.onGoingLoot.has(reaction.message.id)) {
                            clearTimeout(reaction.message.client.onGoingLoot.get(reaction.message.id));
                        }
                        reaction.message.client.execute('loot', reaction);
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