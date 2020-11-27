// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'greet',
    description: {
        "fr": "Lance le tutoriel pour un joueur",
        "en": "Send the tutorial to a player"
    },
    secret: true,
    locked: true,
    execute(message, user) {
        const language = message.client.getLanguage(message.channel);

        user.send(
            {
                'fr':
                    'Salut ! Je suis Pikpik, le futur bot de nowel.\n' +
                    'Mais je vais sans doute me faire remplacer par un personnage plus charismatique...\n' +
                    'Comme tu peux le voir c\'est Nowel ! Il y a plein de truc à faire, et on a besoin de toi ;)\n',
                'en':
                    "Hey ! I'm Pikpik the futur Kwismas bot\n" +
                    "Blabla bla bla\n" +
                    "It is Kwismas ! There is plenty of things to do, and we need you !"
            }[language],
            {
                files: ["https://cdn.discordapp.com/attachments/770768439773888532/779759907158753290/89045.png"] //TODO : Add the correct image
            }).then(msg => {
                msg.channel.send(
                    {
                        'fr':
                            'Voyons les craft : `!craft`\n*🇬🇧 `!english`*',
                        'en':
                            "Let's check what we can craft `!craft` \n*🇨🇵 `!francais`*"
                    }[language]);
        });

        message.client.inventory.addItemToUser(user.id, 'quest0_available');
        message.client.inventory.addItemToUser(user.id, 'boule_verte', 2);
        message.client.inventory.setItemToUser(user.id, 'language', language);

    }
};