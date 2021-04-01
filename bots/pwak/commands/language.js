module.exports = {
    name: 'language',
    aliases: ['langue', 'french', 'francais', 'anglais', 'english'],
    description: {
        "fr": "Change de langue",
        "en": "Switch language"
    },
    delete: true,
    execute(message, args) {

        if(message.client.inventory.userHasItems(message.author.id)){
            if(message.client.inventory.getTrueItemOfUser(message.author.id, 'language') === 'fr'){
                message.client.inventory.setItemToUser(message.author.id, 'language', 'en');
                message.author.send("Language switched to : English 🇬🇧");
            }else{
                message.client.inventory.setItemToUser(message.author.id, 'language', 'fr');
                message.author.send("Changement de langue : Francais 🇨🇵");
            }
        }

        else{
            return message.reply('Vous ne participez pas encore à l\'évenement de Nowel\nYou don\'t participate yet in Kwismas event');
        }
    },
};