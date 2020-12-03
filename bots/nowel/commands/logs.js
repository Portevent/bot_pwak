const fs = require("fs");

module.exports = {
    name: 'logs',
    aliases: ['sl', 'slog'],
    description: {
        "fr": "Affiche les logs (short)",
        "en": "Show log (short)"
    },
    admin: true,
    execute(message, args) {
        fs.readFile('./log.log', 'utf8', function(err, data) {
            if (err) throw err;
            message.author.send(data.substr(-300));
        });
    },
};