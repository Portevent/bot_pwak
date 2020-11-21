// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'send_webhook',
    description: 'Envoi un webhook depuis un message',
    args: 2,
    usage: ' url id_message',
    deleteCommand: true,
    execute(message, args) {
        message.channel.messages.fetch(args[1]).then(messageCopyFrom => message.client.sendWebhookFromUrl(args[0], messageCopyFrom));
        message.react('👍');
    },
};