module.exports = {
    name: 'reload',
    alias: ['r', 're'],
    description: {
        "fr": "Recharge une commande",
        "en": "Reloads a command"
    },
    admin: true,
    execute(message, args) {
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (command) {
            delete require.cache[require.resolve(`./${command.name}.js`)];
        }
        try {
            const newCommand = require(`./${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${commandName}\` was reloaded!`);
        } catch (error) {
            message.client.logErrorMsg(error, message);
        }

    },
};