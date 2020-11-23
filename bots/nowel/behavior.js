const Inventory = require("../../inventory/inventory.js");
const Nowalmanax = require("../../nowalmanax/nowalmanax");
const Drop = require("../../inventory/drop.js");
const webhook_template = require("../../webhook_template.json");
const cron = require('node-cron');

// noinspection JSUnusedLocalSymbols
module.exports = {
    setup(client) {
        client.inventory = new Inventory();
        client.drop_params = require('../../inventory/drop.json');
        client.items = require('../../inventory/items.json');
        client.onGoingLoot = new Map();

        client.messageSinceLastDrop = 0;


    },

    async onceReady(client){
        const nowalmanaxChannel = await client.channels.fetch('774531283426213898');
        client.nowalmanax = new Nowalmanax(nowalmanaxChannel);

        cron.schedule('* * * * *', async function() {
            //Nowalmanax every minutes
            await client.channels.fetch('780095027828752394')
                .then(channel => channel.bulkDelete(100));
            client.nowalmanax.advance();
        });
    },

    nowalmanax(client){
        console.log('nowalmanax !');
    },

    onReaction(reaction, user){
        if(reaction.message.webhookID && reaction.emoji.name === '🎁'){
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
        else if(reaction.message.channel.type === 'dm' && reaction.emoji.name === '🎁') {
            reaction.users.fetch().then(users => {
                if(users.size > 1) {
                    reaction.users.remove(reaction.message.author.id);
                    reaction.message.client.execute('loot_nowalmanax', reaction, user);
                }
            });
        }

        else if(reaction.message.channel.type === 'dm' && reaction.emoji.name === '🛠️') {
            reaction.users.fetch().then(users => {
                if(users.size > 1) {
                    reaction.users.remove(reaction.message.author.id);
                    reaction.message.client.execute('craft_reaction', reaction, user);
                }
            });
        }

        else {
            if(reaction.message.client.inventory.userExists(user.id)){
                reaction.message.client.nowalmanax.reactionValidateQuest(reaction, user);
            }
        }
    },

    onUserMessage(message){
        message.client.execute('attemptDrop', message, []);
        if(message.client.inventory.userExists(message.author.id)) {
            message.client.nowalmanax.messageValidateQuest(message);
        }
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