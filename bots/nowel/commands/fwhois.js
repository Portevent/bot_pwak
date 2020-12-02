module.exports = {
    name: 'fwhois',
    description: {
        "fr": "Retourne un utilisateur (force cache skip)",
        "en": "Show an user (force cache skip)"
    },
    admin: true,
    args: 1,
    async execute(message, args) {
        message.client.users.fetch(args[0], false, true).then(user => {
            message.reply('', {
                embed: {
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