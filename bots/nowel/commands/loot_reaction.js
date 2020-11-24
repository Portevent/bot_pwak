// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'loot_reaction',
    description: {
        "fr": "",
        "en": ""
    },
    secret: true,
    locked: true,
    async execute(messageReaction, args) {
        const language = messageReaction.message.client.getLanguage(messageReaction.message.channel);
        let users = await messageReaction.users.fetch();

        users.delete(messageReaction.message.client.user.id);

        for(let user of users.values()){
            if(!user.bot && !messageReaction.message.client.inventory.userExists(user.id)){
                messageReaction.message.client.execute('greet', messageReaction.message, user);
            }
        }

        const bonus = 1 + users.size/4; // 25% de bonus par joueur participants
        let loot = await messageReaction.message.client.execute('loot', messageReaction.message, [bonus, users]);

        messageReaction.message.client.editWebhook(messageReaction.message.channel, {
            "content": loot.meta_loot.name[language] + " **" + (loot.quantity>1?loot.quantity + 'x':'') + loot.item.emoji + loot.item.name[language] + "**! Bravo " + users.map(user => user.username)
        }, messageReaction.message.id);
        await messageReaction.message.reactions.removeAll();

    },
};