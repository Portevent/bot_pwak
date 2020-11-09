module.exports = {
    name: 'bulk_delete',
    aliases: ['bulk', 'bulkDelete', 'reset', 'delete', 'd', 'b', 'bd', 'clear'],
    description: 'Bulk Delete',
    guildOnly: true,
    cooldown: 0.1,
    execute(message, args) {
        if (!args.length) {
            message.channel.bulkDelete(10);
        }else{
            message.channel.bulkDelete(args[0]);
        }
    },
};