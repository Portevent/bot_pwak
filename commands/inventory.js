const webhooks = require('../webhook_template.json');

module.exports = {
    name: 'inventory',
    aliases: ['inventaire', 'i'],
    description: 'Affiche l\'inventaire',
    execute(message, args) {
        const inventory = message.client.inventory;
        console.log(message.client.inventory);
        console.log(message.client.user.id);
        console.log(inventory);
        let data = [];
        inventory.map(user => {
            data.push("Inventaire : ");
            for(item of user){
                data.push('- ' + item + ' - ');
            }
        })
        message.reply(data);
    },
};