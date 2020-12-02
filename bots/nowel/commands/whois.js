module.exports = {
    name: 'whois',
    description: {
        "fr": "Retourne un utilisateur",
        "en": "Show an user"
    },
    admin: true,
    args: 1,
    async execute(message, args) {
        message.client.users.fetch(args[0]).then(user => {
            message.reply('', {
                'embed': {
                    "description": args[0] + ' : ' + user.id,
                    "author": {
                        "name": user.username,
                        "icon_url": user.avatarURL()
                    }
                }
            })
        })
    },
};