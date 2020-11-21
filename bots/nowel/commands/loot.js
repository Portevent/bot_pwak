const webhooks = require('../../../webhook_template.json');

module.exports = {
    name: 'loot',
    aliases: ['loot'],
    description: 'Loot un message (non inutilisable manuellement)',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    cooldown: 0.1,
    async execute(messageReaction, args) {

        const drop_params = messageReaction.message.client.drop_params;

        let users = await messageReaction.users.fetch();
        users.delete(messageReaction.message.client.user.id);
        console.log(users);

        const bonus = 1 + users.size/4; // 25% de bonus par joueur participants

        const type_drop = Math.random() / bonus; // Le bonus réduit le jet, ce qui augmente les chances de tomber sur des petits chiffres (donc des loots rares)
        const value = (1 + Math.random()/2) * bonus; // Valeur : (1 ~ 1.5) * bonus

        let drops = [];
        let prefix = "";
        let color;

        if(type_drop < drop_params.rare){
            drops = drop_params.rare_drops;
            color = drop_params.rare_color;
        }

        else if(type_drop < drop_params.rare + drop_params.uncommon){
            drops = drop_params.uncommon_drops;
            color = drop_params.uncommon_color;
        }

        else{
            drops = drop_params.common_drops;
            color = drop_params.common_color;
        }


        const items_ids = Object.keys(drops)
        const item_id = items_ids[Math.floor(Math.random() * items_ids.length)]
        // Random drop picked
        let drop_rate = drops[item_id];
        console.log('Drop de ' + item_id);
        const item = messageReaction.message.client.items[item_id];

        const webhook = webhooks.empty_with_embed;

        let quantity = 1;

        webhook.embeds[0].author.icon_url = item.img;
        webhook.embeds[0].color = color;

        if(drop_rate == -1){
            // Drop d'un unique objet
            webhook.embeds[0].author.name = item.name;
        }else{
            quantity =  Math.floor(value * drop_rate);
            webhook.embeds[0].author.name = quantity + 'x ' + item.name;
        }

        webhook.embeds[0].footer.text = " Bravo à " + users.map(user => user.username);

        messageReaction.message.client.editWebhook(messageReaction.message.channel, webhook, messageReaction.message.id);
        messageReaction.message.reactions.removeAll();

        const inventory = messageReaction.message.client.inventory;

        for(data of users){

            inventory.addItemToUser(data[1].id, item_id, quantity);
        }
    },
};