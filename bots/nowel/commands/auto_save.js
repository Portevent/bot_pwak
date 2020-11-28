module.exports = {
    name: 'auto_save',
    description: {
        "fr": "Sauvegarde auto",
        "en": "Create an autosave"
    },
    admin: true,
    secret: true,
    execute(client, args) {
        client.autoSaveCount += 1;
        let filename = "auto_save_" + client.autoSaveCount;
        client.inventory.export(filename);
        client.nowalmanax.export(filename);
    },
};