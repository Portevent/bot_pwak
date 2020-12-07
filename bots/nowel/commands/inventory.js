// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: {
        "fr": "**inventaire** : Affiche l'inventaire",
        "en": "Display the inventory"
    },
    delete: true,
    async execute(message, args) {
        let target = message.author;
        if(args.length && message.client.inventory.userHasItem(message.author.id, 'invspy')){
            const name = args[0].toLowerCase();
            for(let userId of message.client.inventory.inventory.keys()){
                let member = (message.guild?await message.guild.members.fetch(userId):await message.client.referenceGuild.members.fetch(userId));
                if (member
                    && (
                        (member.nickname && member.nickname.toLowerCase().match(new RegExp(name)))
                        ||
                        member.user.username.toLowerCase().match(new RegExp(name))
                        )
                    ){
                    target = member.user;
                    break;
                }
            }
        }
        message.client.sendInventory(target, message.author);
    },
};