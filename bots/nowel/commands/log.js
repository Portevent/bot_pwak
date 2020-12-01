const fs = require("fs");

module.exports = {
    name: 'log',
    description: {
        "fr": "Affiche les logs",
        "en": "Show log"
    },
    admin: true,
    execute(message, args) {
        let log = require("./../../../log.log");
        message.author.send(log);
    },
};