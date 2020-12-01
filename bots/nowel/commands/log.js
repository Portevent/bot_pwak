const fs = require("fs");

module.exports = {
    name: 'log',
    description: {
        "fr": "Affiche les logs",
        "en": "Show log"
    },
    admin: true,
    execute(message, args) {
        fs.readFile('./log.log', 'utf8', function(err, data) {
            if (err) throw err;
            message.author.send(data.substr(-2000));
        });
    },
};