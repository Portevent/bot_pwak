const Drop = require('../../../inventory/drop.js');

module.exports = {
    name: 'drop',
    aliases: ['drop'],
    description: {
        "fr": "Fait apparaitre un cadeau",
        "en": "Spawn a gift"
    },
    admin: true,
    guildOnly: true,
    delete: true,
    execute(message, args) {
        message.client.drop(message.channel);
    },
};