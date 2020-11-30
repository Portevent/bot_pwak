const { prefix } = require('../../../config_files/config.json');

module.exports = {
    name: 'help_admin',
    description: {
        "fr": "Liste des commandes admin",
        "en": "Admin command name"
    },
    aliases: ['true_help', 'admin_help', 'helpadmin', 'helpsecret'],
    usage: '<command?>',
    cooldown: 5,
    admin: true,
    deleteAfter: 5000,
    execute(message, args) {
        //TODO : Enhance the function
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            commands.map(command => {
                if(command.admin ){
                    data.push('\n🔴__' + command.name + '__ : ' + command.description);
                }
            })
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!').then(msg => {
                        msg.delete(5000);
                    });
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?').then(msg => {
                        msg.delete(5000);
                    });
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });

    },
};