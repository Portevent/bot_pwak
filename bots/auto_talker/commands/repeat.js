module.exports = {
    name: 'repeat',
    aliases: ['say', 'talk_to', '-' , '<->', '>'],
    description: 'Force l\'envoi d\' un message',
    guildOnly: true,
    args: 1,
    execute(message, args) {
        message.channel.send(args);
    },
};