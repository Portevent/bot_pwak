// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'send_webhook',
    description: {
        "fr": "",
        "en": ""
    },
    args: 2,
    usage: ' url id_message',
    deleteCommand: true,
    admin: true,
    execute(message, args) {
        message.channel.messages.fetch(args[1]).then(messageCopyFrom => message.client.sendWebhookFromUrl(args[0], messageCopyFrom));
        message.react('👍');
    },
};