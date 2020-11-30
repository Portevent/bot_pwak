module.exports = {
    name: 'drop_on',
    description: {
        "fr": "Active les drops",
        "en": "Activate drops"
    },
    admin: true,
    execute(message, args) {
        message.client.dropOn = true;
        message.react('👍');
    },
};