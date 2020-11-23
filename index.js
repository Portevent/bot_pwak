const fs = require('fs');
const Discord = require('discord.js');
const {bots} = require('./config_files/config.json');
const fetch = require('node-fetch');

for(const bot of bots){
    if(bot.token === "" || bot.type === "") continue;

    const client = new Discord.Client();
    client.prefix = bot.prefix
    client.type = bot.type
    client.token = bot.token
    client.commands = new Discord.Collection();
    client.cooldowns = new Discord.Collection();
    client.webhooks = new Discord.Collection();

    // Setting up the basic commands
    for (const command_name of fs.readdirSync('./bots/_base/commands').filter(file => file.endsWith('.js'))) {
        const command = require('./bots/_base/commands/' + command_name )
        client.commands.set(command.name.toLowerCase(), command);
    }
    // Setting up bot commands
    for (const command_name of fs.readdirSync('./bots/' + bot.type + '/commands').filter(file => file.endsWith('.js'))) {
        const command = require('./bots/' + bot.type + '/commands/' + command_name )
        client.commands.set(command.name.toLowerCase(), command);
    }

    // Setting up the basic behaviors
    const basic_behaviors = require('./bots/_base/behavior.js')
    for(let behavior in basic_behaviors) {
        client[behavior] = basic_behaviors[behavior];
    }
    // Upgrading to new behaviors
    const bot_behaviors = require('./bots/' + bot.type + '/behavior.js');
    for(let behavior in bot_behaviors) {
        // noinspection JSUnfilteredForInLoop
        client[behavior] = bot_behaviors[behavior];
    }

    client.setup(client);

    // noinspection JSUnusedLocalSymbols
    client.login(bot.token).then(r => {});

    client.once('ready', () => {
        client.onceReady(client);
    });

    client.execute = function execute(commandName, message, args = []){
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(command === undefined){
            return console.error("Error " + commandName + " introuvable !");
        }
        return command.execute(message, args);
    }

    client.on('message', message => {
        // noinspection JSUnresolvedFunction
        message.client.onMessage(message);
    });

    client.on('messageReactionAdd', (reaction, user) => {
        // noinspection JSUnresolvedFunction
        reaction.message.client.onReaction(reaction, user);
    });

    // Useful function
    client.sendWebhook = async function sendWebhook(channel, params) {
        try{
            if (!client.webhooks.has(channel.id)) {
                const webhooks = await channel.fetchWebhooks();
                client.webhooks.set(channel.id, webhooks.first());
            }

            const webhook = client.webhooks.get(channel.id);

            await fetch('https://discordapp.com/api/webhooks/' + webhook.id + '/' + webhook.token, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        }catch(error){
            console.error('Error trying to send webhook: ', error);
        }
    }

    // Useful function
    client.sendWebhookFromUrl = async function sendWebhookFromUrl(url, params) {
        console.log(params);
        try{

            await fetch(url, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        }catch(error){
            console.error('Error trying to send webhook: ', error);
        }
    }

    client.editWebhook = function editWebhook(channel, params, messageId) {
        try{
            const webhook = client.webhooks.get(channel.id);

            // noinspection JSIgnoredPromiseFromCall
            fetch('https://discordapp.com/api/webhooks/' + webhook.id + '/' + webhook.token + '/messages/' + messageId , {
                method: 'PATCH',
                body: JSON.stringify(params),
                headers: {
                    'Content-Type': 'application/json'
                }});

        }catch(error){
            console.error('Error trying to send webhook: ', error);
        }
    }

    client.editWebhookFromUrl = function editWebhookFromUrl(url, params, messageId) {
        console.log(params);
        try{
            // noinspection JSIgnoredPromiseFromCall
            fetch(url + '/messages/' + messageId , {
                method: 'PATCH',
                body: JSON.stringify(params),
                headers: {
                    'Content-Type': 'application/json'
                }});

        }catch(error){
            console.error('Error trying to edit webhook: ', error);
        }
    }

}