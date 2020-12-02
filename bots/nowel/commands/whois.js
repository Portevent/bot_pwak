module.exports = {
    name: 'whois',
    description: {
        "fr": "Retourne un utilisateur",
        "en": "Show an user"
    },
    admin: true,
    args: 1,
    async execute(message, args) {
        const user = await message.client.user.fetch(args[0]);
        message.reply('', {
            'embed': {
                "description": user.id,
                "author": {
                    "name": user.username,
                    "icon_url": user.avatarURL()
                }
            }
        })
    },
};