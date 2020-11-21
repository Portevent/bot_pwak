// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'edit_webhook',
    description: 'Modifie un webhook',
    args: 3,
    usage: 'url id_message_pasteTo id_message_copyFrom',
    deleteCommand: true,
    execute(message, args) {
        message.channel.messages.fetch(args[2]).then(messageCopyFrom => message.client.editWebhookFromUrl(args[0], messageCopyFrom, args[1]));
        message.react('👍');
    },
};