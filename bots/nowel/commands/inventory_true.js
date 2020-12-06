// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'inventory_true',
    description: {
        "fr": "**inventaire** : Affiche l'inventaire (avec objets cachés)",
        "en": "Display the inventory (with the hidden items)"
    },
    admin: true,
    execute(message, args) {
        message.client.sendInventory(message.author, message.author.dmChannel, true, true);
    },
};