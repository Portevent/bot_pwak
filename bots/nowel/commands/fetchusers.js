module.exports = {
    name: 'fetchusers',
    aliases: ['fetch_users'],
    description: {
        "fr": "Fetch les utilisateurs",
        "en": "Fetch users"
    },
    admin: true,
    delete: true,
    execute(message, args) {
        for(user of message.client.inventory.inventory.keys()) {
            message.client.users.fetch(user);
        }
        message.reply("Users : " + message.client.inventory.inventory.keys());
    },
};