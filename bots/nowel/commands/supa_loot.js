// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'supa_loot',
    aliases: ['l+', 'sloot'],
    description: {
        "fr": "Loot 10 fois !",
        "en": "Loot 10 times !"
    },
    secret: true,
    admin: true,
    async execute(message, args) {
        const language = message.client.getLanguage(message.channel);

        let text = "";

        for (let i = 0; i < 10; i++) {
            let loot = await message.client.execute('loot', message, [3]);
            text += loot.item.emoji + loot.item.name[language] + " : " + loot.quantity + "\n";
        }

        message.reply(text);

    },
};