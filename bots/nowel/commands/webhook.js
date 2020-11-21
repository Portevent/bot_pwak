const webhooks = require('../../../webhook_template.json');

module.exports = {
    name: 'webhook',
    aliases: ['wh'],
    description: 'Send webhook',
    execute(message, args) {
        if(args.length >= 2){
            message.client.editWebhook(message.channel, webhooks[args[0]], args[1]);
        }else{
            message.client.sendWebhook(message.channel, webhooks[args[0]]);
        }
    },
};