const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: 'Affiche l\'inventaire',
    execute(message, args) {


        const userId = message.author.id;
        const userName = message.author.username;
        const userAvatar = message.author.avatarURL();
        const inventory = message.client.inventory.getInventoryOfUser(userId);

        if(!inventory){
            return message.reply("Tu n'as pas encore d'inventaire");
        }

        let webhook = {
            "username": "Inventaire",
            "avatar_url": "https://cdn.discordapp.com/attachments/770768439773888532/775420082285183036/icon__0027_Inventaire.png",
            "embeds": [
                {
                    "description": "",
                    "author": {
                        "name": userName,
                        "icon_url": userAvatar
                    },
                    "fields": []
                }
            ]
        };

        for(let category of Object.keys(inventory)){
            let text = "";
            for(let item of inventory[category].items){
                if(item.quantity > 0)
                    text += item.emoji + " : " + item.quantity + "\n";
            }

            if(text != ""){
                webhook.embeds[0].fields.push({
                    "name": inventory[category].name,
                    "inline": true,
                    "value": text
                })
            }
        }

        message.client.sendWebhook(message.channel, webhook);
    },
};