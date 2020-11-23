// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'greet',
    description: 'Lance le tutoriel pour un joueur (non utilisable manuellement)',
    secret: true,
    locked: true,
    execute(message, user) {
        user.send('Salut ! Je suis Pikpik, le futur bot de nowel.' +
            'Mais je vais sans doute me faire remplacer par un personnage plus charismatique...' +
            'Comme tu peux le voir c\'est Nowel ! Il y a plein de truc à faire, et on a besoin de toi ;)',
            {
                embed:{
                    "title": "Ouvre des cadeaux",
                    "description": "<:Boule_De_Nowel_Rouge:779651342188150804> Et collecte tous pleins d'objets (`!inventaire`)",
                    "color": 13235055,
                    "thumbnail": {
                        "url": "https://cdn.discordapp.com/attachments/770768439773888532/779759907158753290/89045.png"
                    }
                }
            });

        user.send('', {
            embed: {
                "title": "Collecte les cadeaux quotidiens",
                "description": "Fonce récolter ton premier cadeau : <#780095027828752394>",
                "color": 9106232,
                "thumbnail": {
                    "url": "https://cdn.discordapp.com/attachments/770768439773888532/774943394278801418/153015.png"
                }
            }
        });

        user.send('', {
            embed: {
                "title": "Fabrique l'Étoile de Nowel",
                "description": "Pour faire de se Nowel le plus de tous (`!craft`)",
                "color": 2946356,
                "thumbnail": {
                    "url": "https://cdn.discordapp.com/attachments/770768439773888532/780534292684996639/1.png"
                }
            }
        });

        message.client.inventory.addItemToUser(user.id, 'item_start_quest1');
    },
};