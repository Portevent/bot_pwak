// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'loot_reaction',
    description: 'Loot un message (non inutilisable manuellement)',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    cooldown: 0.1,
    async execute(messageReaction, args) {
        let users = await messageReaction.users.fetch();

        users.delete(messageReaction.message.client.user.id);

        const bonus = 1 + users.size/4; // 25% de bonus par joueur participants
        let loot = await messageReaction.message.client.execute('loot', messageReaction.message, [bonus, users]);

        messageReaction.message.client.editWebhook(messageReaction.message.channel, {
            "content": loot.meta_loot.name + " **" + (loot.quantity>1?loot.quantity + 'x':'') + loot.item.emoji + loot.item.name + "**! Bravo à " + users.map(user => user.username)
        }, messageReaction.message.id);
        await messageReaction.message.reactions.removeAll();

    },
};