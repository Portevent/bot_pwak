// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'summon',
    aliases: ['invoquer'],
    description: {
        "fr": "Lance l'invocation du Craqueleur de Glace",
        "en": "Start the Ice Crackler summoning"
    },
    delete: true,
    guildOnly: true,
    require: 'quete3on',
    execute(message, args) {
        if(message.client.inventory.userHasItem(message.author.id, "quete3on")){
            message.client.inventory.setItemToUser(message.author.id, "quete3on", 0);
            message.client.dropQuest(message.channel, message.member.toString());
        }
    },
};