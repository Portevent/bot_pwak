module.exports = {
    name: 'bulk_delete',
    aliases: ['bulk', 'delete', 'clear'],
    description: {
        "fr": "Supprime des messages en masse",
        "en": "Bulk delete messages"
    },
    guildOnly: true,
    admin: true,
    execute(message, args) {
        if (!args.length) {
            // noinspection JSIgnoredPromiseFromCall
            message.channel.bulkDelete(100);
        }else{
            // noinspection JSIgnoredPromiseFromCall
            message.channel.bulkDelete(args[0]);
        }
    },
};s