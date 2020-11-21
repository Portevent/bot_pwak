const webhooks = require('../../../webhook_template.json');
const Loot = require('../../../inventory/loot.js');
module.exports = {
    name: 'loot',
    aliases: ['loot'],
    description: 'Loot un message (non inutilisable manuellement)',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    cooldown: 0.1,
    async execute(messageReaction, args) {

        let users = await messageReaction.users.fetch();
        users.delete(messageReaction.message.client.user.id);

        const bonus = 1 + users.size/4; // 25% de bonus par joueur participants

        const loot = Loot.getLoot(bonus);

        let quantity = loot.quantity;
        let quantity_text = '';
        if(quantity != -1){
            quantity *= 1 + Math.random()/2;
            quantity *= bonus;
            quantity = Math.ceil(quantity);
            quantity_text = quantity + 'x '
        }else{
            quantity = 1;
        }

        messageReaction.message.client.editWebhook(messageReaction.message.channel, {
            "content": loot.meta_loot.name + " **" + quantity_text + loot.item.emoji + loot.item.name + "**! Bravo à " + users.map(user => user.username),
            "username": "", //TODO : A retirer si possible
            "avatar_url": "",
        }, messageReaction.message.id);
        await messageReaction.message.reactions.removeAll();

        const inventory = messageReaction.message.client.inventory;

        for(data of users){
            inventory.addItemToUser(data[1].id, loot.item.id, quantity);
        }
    },
};