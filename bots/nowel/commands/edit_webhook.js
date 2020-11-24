// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'edit_webhook',
    description: {
        "fr": "Modifie un webhook",
        "en": "Edit a webhook"
    },
    args: 3,
    usage: '<url_webhook> <id_message_pasteTo> <id_message_copyFrom>',
    secret: true,
    admin: true,
    deleteCommand: true,
    execute(message, args) {
        message.channel.messages.fetch(args[2]).then(messageCopyFrom => message.client.editWebhookFromUrl(args[0], messageCopyFrom, args[1]));
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};