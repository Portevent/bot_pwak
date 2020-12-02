module.exports = {
    name: 'save',
    description: {
        "fr": "Sauvegarde",
        "en": "Save everything"
    },
    admin: true,
    execute(message, args) {
        let filename;
        if(args.length){
            filename = args[0];
        }else{
            message.client.autoSaveCount += 1;
            filename = "auto_save_" + message.client.autoSaveCount;
        }
        message.client.inventory.export(filename);
        message.client.nowalmanax.export(filename);
        message.reply("Auto saved : " + filename);
    },
};