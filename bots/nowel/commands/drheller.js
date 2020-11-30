// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'drheller',
    aliases: ['phoreur'],
    description: {
        "fr": '**phoreur** : Affiche le phoreur du jour',
        "en": 'Show the drheller of the day'
    },
    execute(message, args) {
        const language = message.client.getLanguage(message.channel);
        message.author.send(
            {
                "fr": "Phoreur du " + message.client.nowalmanax.day + " Decembre",
                "en": message.client.nowalmanax.day + (message.client.nowalmanax.day===1?"st":(message.client.nowalmanax.day===2?"nd":"th")) + " of December's Drheller"
            }[language]
            + "\n" +
            ((message.client.nowalmanax.usersDroppedMention.has(message.author.id))
            ?
            {
                "fr": "Trouvé (si tu ne l'as pas encore attrapé, c'est que tu l'as sûrement raté. Reviens sur tes pas.)",
                "en": "Found (if you haven't catch if yet, you must have missed it.)"
            }[language]
            :
            {
                "fr": "Pas encore trouvé",
                "en": "Undiscovered"
            }[language]),
            {
                files: [message.client.nowalmanax.emoji.url]
            })
    },
};