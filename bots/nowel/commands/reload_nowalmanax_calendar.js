module.exports = {
    name: 'reload_nowalmanax_calendar',
    description: {
        "fr": "Recharge le calendrier du Nowalmanax (pour debugger)",
        "en": "Reload Kwismalmanax's calendar (debug purpose)"
    },
    admin: true,
    execute(message, args) {
        try{
            delete require.cache[require.resolve("../../nowalmanax/nowalmanax.json")];
            message.author.client.nowalmanax.loadCalendar();
            // noinspection JSIgnoredPromiseFromCall
            message.react('👍');
        }catch(e){
            message.client.logError(e);
        }
    },
};