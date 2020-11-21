const webhooks = require('../../../webhook_template.json');
const items = require('../../../inventory/items.json');

module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: 'Affiche l\'inventaire',
    execute(message, args) {
        const inventory = message.client.inventory;


        const userId = message.author.id;
        const userName = message.author.username;
        const userAvatar = message.author.avatarURL();

        let webhook = {
            "username": "Inventaire",
            "avatar_url": "https://cdn.discordapp.com/attachments/770768439773888532/775420082285183036/icon__0027_Inventaire.png",
            "embeds": [
                {
                    "description": "",
                    "author": {
                        "name": userName,
                        "icon_url": userAvatar
                    }
                }
            ]
        };

        if(inventory.userHasItems(userId)){
            items_id = Object.keys(items);
            for(var i = 0; i < items_id.length; i++) {
                let itemId = items_id[i];
                if(items[itemId].emoji !== "" && inventory.userHasItem(userId, itemId)){
                    webhook.embeds[0].description += ":" + items[itemId].emoji + ": " + inventory.getItemOfUser(userId, itemId) + ' ';
                }
            }
        }

        message.client.sendWebhook(message.channel, webhook).then(console.log('Inventaire sent !'));
    },
};