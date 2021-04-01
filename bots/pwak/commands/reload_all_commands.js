const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'reload_all_commands',
    alias: ['r', 're'],
    description: {
        "fr": "Recharge toutes les commandes",
        "en": "Reloads all commands"
    },
    admin: true,
    execute(message, args) {
        message.client.commands = new Discord.Collection();

        // Setting up the basic commands
        for (const command_name of fs.readdirSync('bots/_base/commands').filter(file => file.endsWith('.js'))) {
            const command = require('../../_base/commands/' + command_name )
            message.client.commands.set(command.name.toLowerCase(), command);
        }

        // Setting up bot commands
        for (const command_name of fs.readdirSync('bots/pwak/commands').filter(file => file.endsWith('.js'))) {
            delete require.cache[require.resolve('../commands/' + command_name )];
            const command = require('../commands/' + command_name )
            message.client.commands.set(command.name.toLowerCase(), command);
        }

        message.reply("Reload all commands");
    },
};