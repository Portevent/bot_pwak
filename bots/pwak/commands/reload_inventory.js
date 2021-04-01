module.exports = {
    name: 'reload_inventory',
    description: {
        "fr": "Importe l'inventaire des joueurs depuis la sauvegarde",
        "en": "Import players inventory from save"
    },
    admin: true,
    execute(message, args) {
        let filename = "save";
        if (args.length) {
            filename = args[0];
        }
        const code = message.author.client.inventory.import(filename);
        if(code == 0){
            message.react('👍');
        }else{
            message.reply(" " + code);
        }
    },
};