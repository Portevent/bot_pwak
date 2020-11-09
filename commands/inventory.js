const webhooks = require('../webhook_template.json');

module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: 'Affiche l\'inventaire',
    execute(message, args) {
        const inventory = message.client.inventory.get(message.author.id);

        let webhook = webhooks.inventory;

        webhook.embeds[0].author.name = message.author.username;
        webhook.embeds[0].author.icon_url = message.author.avatarURL();
        webhook.embeds[0].fields[0].value =
              ' :red_circle: '
            + inventory.has('boule_rouge')?inventory.get('boule_rouge'):'0'
            + ' :yellow_circle: '
            + inventory.has('boule_jaune')?inventory.get('boule_jaune'):'0'
            + ' :green_circle: '
            + inventory.has('boule_verte')?inventory.get('boule_verte'):'0'
            + ' :blue_circle: '
            + inventory.has('boule_bleue')?inventory.get('boule_bleue'):'0'
            + ' :purple_circle: '
            + inventory.has('boule_violette')?inventory.get('boule_violette'):'0';
        webhook.embeds[0].fields[1].value = ':snowflake: ' + inventory.has('flocon_magique')?inventory.get('flocon_magique'):'0';

        message.client.sendWebhook(message.channel, webhook);
    },
};