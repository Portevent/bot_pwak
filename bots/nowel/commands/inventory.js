// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: {
        "fr": "**inventaire** : Affiche l'inventaire",
        "en": "Display the inventory"
    },
    delete: true,
    execute(message, args) {
        message.client.sendInventory(message.author, message.author.dmChannel);
    },
};