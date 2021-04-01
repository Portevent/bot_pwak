module.exports = {
    name: 'reload_nowalmanax',
    description: {
        "fr": "Importe l'avancement des joueurs sur le Nowalmanax du jour depuis la sauvegarde",
        "en": "Import players nowalmanax advancement from save"
    },
    admin: true,
    async execute(message, args) {
        let filename = "save";
        if (args.length) {
            filename = args[0];
        }
        const code = message.author.client.nowalmanax.import(filename);
        if(code == 0){
            message.react('👍');
        }else{
            message.reply(" " + code);
        }
    },
};