// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'supa_loot',
    aliases: ['sl', 'sloot'],
    description: 'Loot multiple times !',
    secret: true,
    adminOnly: true,
    async execute(message, args) {

        let text = "";

        for (let i = 0; i < 10; i++) {
            let loot = await message.client.execute('loot', message, [3]);
            text += loot.item.emoji + loot.item.name + " : " + loot.quantity + "\n";
        }

        message.reply(text);

    },
};