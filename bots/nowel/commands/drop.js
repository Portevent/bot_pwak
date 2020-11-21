const webhooks = require('../../../webhook_template.json');

module.exports = {
    name: 'drop',
    aliases: ['drop'],
    description: 'Force un drop \n **gift** pour forcer un cadeau \n   -*gift 1* : cadeau \n   -*gift 2* : grand cadeau \n   -*gift welcome* : cadeau de bienvenue \n   -*gift open* : cadeau ouvert' +
        '\n **snowmen** bonhomme de neige \n   -*snowmen 1/2/3* : petit/grand/enorme \n **pikpik** pikpik',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    cooldown: 0.1,
    delete: true,
    execute(message, args) {
        function randomGift(params, type = 0){
            let gift = webhooks.small_gift;
            if(type == 1){
                // On force un ptit cadeau
            }
            else if(type == 2 || Math.random() < params.gift_big){
                // Gros cadeau
                gift = webhooks.big_gift;
            }

            let gift_images = [
                'https://cdn.discordapp.com/attachments/770768439773888532/770773711451848704/89044.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773716850311178/89046.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773719781736478/89047.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773722520879124/89048.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773724982542387/89049.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773744284860446/89050.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773751516233767/89051.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773754086686750/89052.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773757941514240/89053.png',
                'https://cdn.discordapp.com/attachments/770768439773888532/770773759426428939/89054.png'
            ]
            // Random gift image
            gift.avatar_url = gift_images[Math.floor(Math.random() * gift_images.length)];

            return gift;
        }

        let webhook;
        const drop_params = message.client.drop_params;

        if(args && args.length && args.length > 0){
            for(let i = 0; i < args[0]; i++){

                message.client.sendWebhook(message.channel, randomGift(drop_params));
            }
        }

        else{

            let nb = Math.random();

            if(nb < drop_params.gift){
                webhook = randomGift(drop_params);
            }

            else {
                webhook = webhooks.pikpik;
            }
        }

        message.client.sendWebhook(message.channel, webhook);
    },
};