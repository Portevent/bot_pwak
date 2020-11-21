const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: 'Affiche l\'inventaire',
    execute(message, args) {


        const userId = message.author.id;
        const userName = message.author.username;
        const userAvatar = message.author.avatarURL();
        const inventory = message.client.inventory.getItemsOfUser(userId);

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

        for(let item_id of inventory.keys()){
            const item = Item.get(item_id);
            webhook.embeds[0].description += item.emoji + item.name + " : " + inventory.get(item_id) + "\n";
        }

        message.client.sendWebhook(message.channel, webhook).then(console.log('Inventaire sent !'));
    },
};