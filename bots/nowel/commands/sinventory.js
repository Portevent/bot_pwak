// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'sinventory',
    aliases: ['sinventaire', 'si'],
    description: {
        "fr": "**inventaire** : Affiche l'inventaire d'un joueur (avec son ID)",
        "en": "Display someone inventory (based on id)"
    },
    admin: true,
    args: 1,
    async execute(message, args) {


        const userId = args[0];
        const user = await message.client.users.fetch(userId);
        const userName = user.username;
        const userAvatar = user.avatarURL();
        const inventory = message.client.inventory.getInventoryOfUser(userId);

        const language = message.client.getLanguage(message.channel);

        if(!inventory){
            return message.author.send({
                "fr": "Tu n'as pas encore d'inventaire",
                "en": "You don't have any items yet"
            }[language]);
        }

        let webhook = {
            "username": {
                "fr": "Inventaire",
                "en": "Inventory"
            }[language],
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

            if(inventory[category].hideInInventory) continue;

            for(let item of inventory[category].items){
                if(item.quantity > 0) {
                    if (inventory[category].displayFullNameInInventory) {
                        text += item.emoji + item.name[language] + (item.quantity > 1 ? ' (' + item.quantity + ')' : '') + "\n";
                    } else {
                        text += item.emoji + " : " + item.quantity + "\n";
                    }
                }
            }

            if(text !== ""){
                webhook.embeds[0].fields.push({
                    "name": inventory[category].name[language],
                    "inline": true,
                    "value": text
                })
            }
        }

        if(message.channel.type === "dm" || true){
            webhook.embeds[0].title = webhook.username;
            message.author.send('', {
                embed: webhook.embeds[0]
            });
        }

        else{
            message.client.sendWebhook(message.channel, webhook);
        }
    },
};