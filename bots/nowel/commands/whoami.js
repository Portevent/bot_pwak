module.exports = {
    name: 'whoami',
    description: {
        "fr": "Retourne l'utilisateur",
        "en": "Show the user"
    },
    admin: true,
    execute(message, args) {
        message.reply('User id : ' + message.user.id);
        message.reply('User username : ' + message.user.username);
    },
};