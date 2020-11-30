// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'attempt_drop',
    description: {
        "fr": 'Tente un drop de cadeau / collectable (Utilisé quand quelqu\'un envoi un message)',
        "en": 'Run a gift/collectable drop attempt (used when someone send a message)'
    },
    admin: true,
    guildOnly: true,
    secret: true,
    execute(message, args) {
        if(!message.client.dropOn) return;

        let nb = Math.random() * Math.max(1, 1 + (2 * (5 - message.client.messageSinceLastDrop)));
        console.log(nb);
        if(nb < 0.2){
            message.client.execute('drop', message, []);
            message.client.messageSinceLastDrop = 0;
        }else{
            message.client.messageSinceLastDrop++;
        }
    },
};