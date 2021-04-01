module.exports = {
    name: 'react',
    aliases: [],
    description: 'Réagis à un message avec 🎁',
    guildOnly: true,
    execute(message, args) {
        if(args[0]){
            message.channel.messages.fetch(args[0])
                .then(message => message.react('🍫'));
        }else{
            message.react('🍫');
        }
    },
};