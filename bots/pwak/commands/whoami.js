module.exports = {
    name: 'whoami',
    description: {
        "fr": "Retourne l'utilisateur",
        "en": "Show the user"
    },
    admin: true,
    execute(message, args) {
        message.reply('User id : ' + message.author.id);
        message.reply('User username : ' + message.author.username);
    },
};