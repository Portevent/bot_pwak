module.exports = {
    name: 'roles',
    aliases: [],
    description: 'Retourne le role',
    guildOnly: true,
    execute(message, args) {
        console.log( message.member.roles.highest);
        message.channel.send( message.member.roles);

    },
};