module.exports = {
    name: 'fwhois',
    description: {
        "fr": "Retourne un utilisateur (force cache skip)",
        "en": "Show an user (force cache skip)"
    },
    admin: true,
    args: 1,
    async execute(message, args) {
        message.client.check(args[0], 'Manual check');
    },
};