// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'loot_reaction',
    description: {
        "fr": "",
        "en": ""
    },
    secret: true,
    locked: true,
    async execute(messageReaction, users) {
        const language = messageReaction.message.client.getLanguage(messageReaction.message.channel);

        let messages = await messageReaction.message.channel.messages.fetch({ limit: 10 })

        users.delete(messageReaction.message.client.user.id);

        let bonus = 1 + users.size/4; // 25% de bonus par joueur participants

        for(let user of users.values()){
            if(!user.bot && !messageReaction.message.client.inventory.userExists(user.id)){
                messageReaction.message.client.execute('greet', messageReaction.message, user);
            }

            user.badges = [];
            let bad_karmas = 1;
            for(let message of messages.values()){
                if(message.author.id = user.id){
                    bad_karmas = -2;
                    break;
                }
            }

            bad_karmas = messageReaction.message.client.inventory.safeAddItemToUser(user.id, 'bad_karma', -2);

            if(bad_karmas >= 10){
                user.ownBonus = 0.1;
                user.badges.push('❗');
            }

            if(messageReaction.message.client.inventory.userHasItem(user.id, 'quete1')){
                user.badges.push('<:etoile:780851276094767104>');
                bonus += 0.2;
            }
        }

        let loot = await messageReaction.message.client.execute('loot', messageReaction.message, [bonus, users]);

        messageReaction.message.client.editWebhook(messageReaction.message.channel, {
            "content": loot.meta_loot.name[language] + " **" + (loot.quantity>1?loot.quantity + 'x':'') + loot.item.emoji + loot.item.name[language] + "**! Bravo" + users.map(user => ' ' + user.badges.map(emote => emote) + user.username)
        }, messageReaction.message.id);
        await messageReaction.message.reactions.removeAll();

    },
};