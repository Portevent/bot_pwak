const webhooks = require('../webhook_template.json');

module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: 'Affiche l\'inventaire',
    execute(message, args) {
        console.log('Inventaire en cours...');
        const inventory = message.client.inventory.get(message.author.id);

        let webhook = webhooks.inventory;

        webhook.embeds[0].author.name = message.author.username;
        webhook.embeds[0].author.icon_url = message.author.avatarURL();

        if(inventory){
            console.log('Inventaire found !');
            console.log(inventory.has('boule_rouge')?'A':'B');
            console.log(inventory.get('boule_rouge'));
            webhook.embeds[0].fields[0].value = ' :red_circle: ' + (inventory.has('boule_rouge')?inventory.get('boule_rouge').toString():'0')
                + ' :yellow_circle: ' + (inventory.has('boule_jaune')?inventory.get('boule_jaune').toString():'0')
                + ' :green_circle: '  + (inventory.has('boule_verte')?inventory.get('boule_verte').toString():'0')
                + ' :blue_circle: ' + (inventory.has('boule_bleue')?inventory.get('boule_bleue').toString():'0')
                + ' :purple_circle: ' + (inventory.has('boule_violette')?inventory.get('boule_violette').toString():'0');
            webhook.embeds[0].fields[1].value = ':snowflake: ' + (inventory.has('flocon_magique')?inventory.get('flocon_magique').toString():'0');
            console.log(webhook.embeds[0].fields[0].value);
        }

        console.log('Inventaire sending ...')
        console.log(webhook);
        message.client.sendWebhook(message.channel, webhook).then(console.log('Inventaire sent !'));
    },
};