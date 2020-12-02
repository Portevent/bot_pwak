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
                    "description": "Id : " + user.id,
                    "author": {
                        "name": user.username,
                        "icon_url": user.avatarURL()
                    }
                }
            })
        }).catch(
            err => message.client.logErrorMsg(err, message)
        )
    },
};