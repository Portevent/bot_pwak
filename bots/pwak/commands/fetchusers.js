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
        let users = "";
        for(user of message.client.inventory.inventory.keys()) {
            users += user + " ";
            message.client.users.fetch(user);
        }
        message.reply("Users : " + users);
    },
};