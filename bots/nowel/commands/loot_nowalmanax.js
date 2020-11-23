// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'loot_nowalmanax',
    description: 'Loot un message Nowalmanax (non utilisable manuellement)',
    secret: true,
    locked: true,
    async execute(messageReaction, user) {

        messageReaction.message.client.inventory.getItemOfUser(user.id, ':nowalamanax_star:');


    },
};