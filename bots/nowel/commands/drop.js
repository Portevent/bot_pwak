const Drop = require('../../../inventory/drop.js');

module.exports = {
    name: 'drop',
    aliases: ['drop'],
    description: 'Force un drop',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    cooldown: 0.1,
    delete: true,
    execute(message, args) {
        let nb = 1

        if(args && args.length && args.length > 0){
            nb = args[0]
        }

        for(let i = 0; i < nb; i++){
            const drop = Drop.getDrop();
            message.client.sendWebhook(message.channel, {
                "content": drop.description,
                "username": drop.title,
                "avatar_url": drop.image || Drop.getGift()
            });
        }
    },
};