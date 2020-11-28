module.exports = {
    name: 'save_nowalmanax',
    description: {
        "fr": "Sauvegarde la liste des joueurs ayant completé le Nowalmanax du jour",
        "en": "Save the current Kwismalmanax completition list"
    },
    admin: true,
    execute(message, args) {
        let filename = "save";
        if (args.length) {
            filename = args[0];
        }
        message.author.client.nowalmanax.export(filename);
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};