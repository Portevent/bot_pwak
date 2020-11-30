// noinspection SpellCheckingInspection
module.exports = {
    name: 'help',
    description: {
        'fr': 'Liste des commandes',
        'en': 'Commands list'
    },
    aliases: ['commands', 'aide', 'ls', 'list', 'liste'],
    usage: '[command name]',
    cooldown: 5,
    deleteCommand: true,
    deleteAfter: 5000,
    execute(message, args) {
        const language = message.client.getLanguage(message.channel);
        const data = [];
        const commands = message.client.commands;

        if (!args.length) {
            data.push({
                'fr':'Liste des commandes (pas encore tout traduit)',
                'en': 'Command list (pas encore tout traduit)'
            }[language]);
            commands.map(command => {
                if(!command.secret && !command.admin){
                    data.push('**' + command.name + '** : ' + command.description[language] + (command.usage?'`' + message.client.prefix + command.name + ' ' + command.usage + '`':''));
                }
            })
            data.push(`\nPour avoir plus de détails sur une commande : \`${message.client.prefix}help [commande]\` `);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('Je t\'ai envoyé toutes les commandes en message privé !').then(message => message.delete(10000));
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('Est ce que je peux t\'envoyer la liste des commandes en message privé ? Il faut que tu les ouvres pour moi :flushed:').then(message => message.delete(10000));
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Cette commande n\'existe pas...');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${message.client.prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        // noinspection JSIgnoredPromiseFromCall
        message.channel.send(data, { split: true });

    },
};