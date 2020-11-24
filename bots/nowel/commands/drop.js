const Drop = require('../../../inventory/drop.js');

module.exports = {
    name: 'drop',
    aliases: ['drop'],
    description: {
        "fr": "Fait apparaitre un cadeau",
        "en": "Spawn a gift"
    },
    admin: true,
    guildOnly: true,
    delete: true,
    execute(message, args) {
        const language = message.client.getLanguage(message.channel);

        let nb = 1

        if(args && args.length && args.length > 0){
            nb = args[0]
        }

        for(let i = 0; i < nb; i++){
            const drop = Drop.getDrop();
            // noinspection JSIgnoredPromiseFromCall
            message.client.sendWebhook(message.channel, {
                "content": drop.description[language],
                "username": drop.title[language],
                "avatar_url": drop.image || Drop.getGift()
            });
        }
    },
};