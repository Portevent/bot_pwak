// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'nowalmanax_repport',
    aliases: ['nr'],
    description: {
        "fr": "Affiche le Nowalmanax",
        "en": "Show the Kwismalmanax"
    },
    admin: true,
    async execute(message, args) {
        users = ""
        for(let userId of message.client.nowalmanax.usersDroppedMention.keys()){
            let user = await message.client.users.fetch(userId);
            users += user.username + '*(' + user.id + ')*\n';
        }
        message.reply('',{
            embed: {
                "description": "Done by " + users,
                "author": {
                    "name": "Jour : " + message.client.nowalmanax.day,
                    "icon_url": message.client.nowalmanax.emoji.url,
                }}
        });
    },
};