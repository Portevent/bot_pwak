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
                embed:{
                    "title": {
                        "fr": "Ouvre des cadeaux",
                        "en": "Open gifts"
                    }[language],
                    "description": {
                        "fr": "<:Boule_De_Nowel_Rouge:779651342188150804> Et collecte tous pleins d'objets (`!inventaire`)",
                        "en": "<:Boule_De_Nowel_Rouge:779651342188150804> And collect tons of items (`!inventory`)"
                    }[language],
                    "color": 13235055,
                    "thumbnail": {
                        "url": "https://cdn.discordapp.com/attachments/770768439773888532/779759907158753290/89045.png"
                    }
                }
            });

        /* user.send('', {
            embed: {
                "title": {
                    "fr": "Collecte les cadeaux quotidiens",
                    "en": "Collect daily gift"
                }[language],
                "description": {
                    "fr": "Fonce récolter ton premier cadeau : <#780095027828752394>",
                    "en": "Go get your first gift : <#780095027828752394>"
                }[language],
                "color": 9106232,
                "thumbnail": {
                    "url": "https://cdn.discordapp.com/attachments/770768439773888532/774943394278801418/153015.png"
                }
            }
        });

         user.send('', {
            embed: {
                "title": {
                    "fr": "Fabrique l'Étoile de Nowel",
                    "en": "Craft Kwismas start !"
                }[language],
                "description": {
                    "fr": "Pour faire de se Nowel le plus beau de tous (`!craft`)",
                    "en": "And this Kwismas will be the niccest one (`!craft`')"
                }[language],
                "color": 2946356,
                "thumbnail": {
                    "url": "https://cdn.discordapp.com/attachments/770768439773888532/780534292684996639/1.png"
                }
            }
        });*/
        user.send(
            {
                'fr':
                    'Voyons les craft : `!craft`\n*🇬🇧 `!english`*',
                'en':
                    "Let's check what we can craft `!craft` \n*🇨🇵 `!francais`*"
            }[language]);

        message.client.inventory.addItemToUser(user.id, 'start_quest0');
        message.client.inventory.addItemToUser(user.id, 'boule_verte', 2);
        message.client.inventory.setItemToUser(user.id, 'language', language);

    }
};