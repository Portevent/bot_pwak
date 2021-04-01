// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_calendar',
    aliases: ['nc'],
    description: {
        "fr": "Affiche le Nowalmanax",
        "en": "Show the Kwismalmanax"
    },
    admin: true,
    async execute(message, args) {
        let text = ""
        let i = 0
        for(let emojiId of message.client.nowalmanax.emojis){
            text += i + ' : ' + message.client.emojis.cache.find(emoji => emoji.id === emojiId).toString() + (i==message.client.nowalmanax.day?"<":"") + '\n';
            i += 1;
        }
        message.reply(text);
    },
};