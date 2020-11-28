module.exports = {
    name: 'save_inventory',
    description: {
        "fr": "Sauvegarde l'inventaire des joueurs vers la sauvegarde",
        "en": "Save players inventory"
    },
    admin: true,
    execute(message, args) {
        let filename = "save";
        if (args.length) {
            filename = args[0];
        }
        message.author.client.inventory.export(filename);
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};