module.exports = {
    name: 'reload_loots',
    description: {
        "fr": "Recharge le calendrier du Nowalmanax (pour debugger)",
        "en": "Reload Kwismalmanax's calendar (debug purpose)"
    },
    admin: true,
    execute(message, args) {
        message.author.client.nowalmanax.loadCalendar();
        // noinspection JSIgnoredPromiseFromCall
        message.react('👍');
    },
};