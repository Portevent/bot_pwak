module.exports = {
    name: 'drop_off',
    description: {
        "fr": "Desactive les drops",
        "en": "Deactivate drops"
    },
    admin: true,
    execute(message, args) {
        message.client.dropOn = false;
        message.react('👍');
    },
};