// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'inventory_spy',
    aliases: ['inventaire_spy', 'si', 'is'],
    description: {
        "fr": "**inventaire** : Affiche l'inventaire d'un joueur (avec son ID)",
        "en": "Display someone inventory (based on id)"
    },
    admin: true,
    args: 1,
    async execute(message, args) {
        message.client.users.fetch(args[0]).then(user => {
            message.client.sendInventory(user, message.author.dmChannel, true, true);
        });
    },
};