const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix, tokensAutoTalker} = require('./config_files/config.json');
const fetch = require('node-fetch');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const autoTalkerCommandFiles = fs.readdirSync('./autoTalkerCommand').filter(file => file.endsWith('.js'));
const webhooks_templates = require('./webhook_template.json');
const Inventory = require('./inventory.js');

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.webhooks = new Discord.Collection();
client.inventory = new Inventory();
client.drop_params = require('./drop_param.json');
client.items = require('./items.json');
client.onGoingLoot = new Discord.Collection();

client.messageSinceLastDrop = 0;


for (const token of tokensAutoTalker) {
    const client_autoTalker = new Discord.Client();
    client_autoTalker.commands = new Discord.Collection();
    client_autoTalker.stop = false;

    for (const file of autoTalkerCommandFiles) {
        const command = require(`./autoTalkerCommand/${file}`);
        client_autoTalker.commands.set(command.name, command);
    }

    client_autoTalker.login(token);

    client_autoTalker.once('ready', () => {
        client_autoTalker.user.setStatus('online');
        console.log('Auto Talker ready !');
    });

    client_autoTalker.on('message', message => {
        if(message.author.id == message.client.user.id) return; //On ne traite pas ses propres messages

        if(message.channel.type === 'dm' && !(message.content.startsWith('<@!' + message.client.user.id + '>') || message.content.startsWith('<@' + message.client.user.id + '>') || message.content.startsWith('all '))){
            message.content = "all " + message.content;
        }
        if (message.content.startsWith('<@!' + message.client.user.id + '>') || message.content.startsWith('<@' + message.client.user.id + '>') || message.content.startsWith('all ')){
            const args = message.content.trim().split(/ +/);
            args.shift();

            let commandName = args.shift();

            if(!commandName) commandName = 'reply';

            let command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) command = message.client.commands.get('reply');

            try {
                command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('Erreur pendant l\'executation de la commande...');
            }
        }else if(message.webhookID){
            if(!message.client.stop) {
                let timer = setTimeout(() => {
                    message.react('🎁');
                }, 1000+Math.random()*1000);
            }
        }
    });
}

client.login(token);

client.once('ready', () => {
    console.log('Main bot ready !');
});

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.execute = function execute(commandName, message, args = []){
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    command.execute(message, args);
}

client.sendWebhook = async function sendWebhook(channel, params) {
    try{
        if (!client.webhooks.has(channel.id)) {
            const webhooks = await channel.fetchWebhooks();
            client.webhooks.set(channel.id, webhooks.first());
        }

        const webhook = client.webhooks.get(channel.id);

        fetch('https://discordapp.com/api/webhooks/' + webhook.id + '/' + webhook.token, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }});

    }catch(error){
        console.error('Error trying to send wehbook: ', error);
    }
}

client.editWebhook = function editWebhook(channel, params, messageId) {
    try{
        const webhook = client.webhooks.get(channel.id);

        fetch('https://discordapp.com/api/webhooks/' + webhook.id + '/' + webhook.token + '/messages/' + messageId , {
            method: 'PATCH',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }});

    }catch(error){
        console.error('Error trying to send wehbook: ', error);
    }
}

client.on('message', message => {
    if(message.author.id == message.client.user.id) return; //On ne traite pas ses propres messages

    console.log(message.content);

    if(message.channel.type === 'dm' && !message.content.startsWith(prefix)){
        message.content = prefix + " " + message.content;
    }

    if ((message.content.startsWith(prefix) || prefix == "") && !message.author.bot){
        if(message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('Désolé, cette commande ne marche pas en message privé !');
        }

        if (command.args     && (!args.length || args.length < command.args)) {
            let reply = `Il manque des arguments ${message.author} !`;

            if (command.usage) {
                reply += `\nUsage : \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }
        try {
            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Discord.Collection());
            }

            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            client.execute(commandName, message, args);

            if(command.delete){
                message.delete();
            }
        } catch (error) {
            console.error(error);
            message.reply('Erreur pendant l\'executation de la commande...');
        }
    }

    else if(message.webhookID){
        console.log(message.author.username)
        if(message.author.username == 'Un Cadeau Apparait !') {
            message.react('🎁');
        }
        if(message.author.username == 'Un Gros Cadeau Apparait !'){
            message.react('🎁');
        }
        if(message.author.username == 'Il neige !'){
            message.react('⛄');
            let timer = setTimeout(() => {
                message.client.editWebhook(message.channel, webhooks_templates.small_snowmen, message.id);
            }, 60*1000);
        }
    }

    else if(message.channel.type != 'dm'){
        client.execute('attemptDrop', message, []);
    }

});

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.message.webhookID){
        if(reaction.emoji.name == '🎁'){
            let min = 998;
            let max = 999;
            if(reaction.message.author.username == 'Un Cadeau Apparait !') {
                min = 2;
                max = 4;
            }
            if(reaction.message.author.username == 'Un Gros Cadeau Apparait !'){
                min = 4;
                max = 8;
            }

            reaction.users.fetch().then(users => {
                console.log(users.size);
                if(users.size >= min){
                    if(reaction.message.client.onGoingLoot.has(reaction.message.id)){
                        return;
                    }
                    reaction.message.react('🥁');
                    let timer = setTimeout(() => {
                        reaction.message.client.execute('loot', reaction);
                    }, 5*1000);
                    reaction.message.client.onGoingLoot.set(reaction.message.id, timer);
                }

                if(users.size >= max){
                    console.log("MAX !");
                    if(reaction.message.client.onGoingLoot.has(reaction.message.id)) {
                        clearTimeout(reaction.message.client.onGoingLoot.get(reaction.message.id));
                    }
                    reaction.message.client.execute('loot', reaction);
                }
            })
        }
    }
});