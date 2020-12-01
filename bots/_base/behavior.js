// noinspection JSUnusedLocalSymbols,JSUnresolvedVariable
module.exports = {
    //prefix:'!', /!\ Override any bot prefix

    prefixOptionalInDm: true,

    onceReady(client) {
        console.log('Bot ' + client.type + ' ready (' + client.token.substr(1,7) + ')');
    },

    onOwnMessage(message){

    },

    onCommand(message, args, commandName){
        console.log("<#" + message.channel.id + "> <@" + message.author.id + "> " + commandName + " : " + args);
        message.client.execute(commandName, message, args);
    },

    onNullCommand(message){
        
        message.reply('Si tu as besoin d\'aide, n\'hésite pas à utiliser `' + message.client.prefix + 'help` :wink:');
    },

    onInvalidCommand(message, args, commandName){
        
        message.reply('La commande `' + commandName + '` n\'existe pas...\n' +
            'Si tu as besoin d\'aide, n\'hésite pas à utiliser `' + message.client.prefix + 'help` :wink:')
    },

    onCommandError(message, args, error, command){
        
        message.channel.send('Erreur lors de l\'éxécution de ' + command.name + '\n' + error);
        
        console.error("##### ERREUR #### \n" +
            "## Message : " + message +
            "\n ## Erreur : " + error);
    },

    onCommandInvalidGuildOnly(message, args, command){
        
        message.reply('Cette commande ne marche pas en message privé :slight_frown:');
    },

    onInvalidCommandRight(message, args, command){
        message.reply('Droits insuffisants :slight_frown:');
    },

    onCommandInvalidDmOnly(message, args, command){
        message.reply('Cette commande ne marche pas qu\'en message privé. Tu peux slide dans mes dm :relieved:');
    },

    onCommandInvalidArgsCount(message, args, command){
        message.reply('`' + command.name + '` nécessite au moins ' + command.args + ' arguments ');
    },

    
    onCommandInvalidCooldown(message, args, command, timeLeft){
        message.reply('Merci d\'attendre `' + timeLeft + '` seconde(s) avant de réutiliser `' + command.name + '`');
    },

    onReaction(reaction, user){

    },
    onUserMessage(message){

    },
    onBotMessage(message){

    },
    onWebhook(message){

    },

    onMessage(message) {
        console.log("Traitement de : <#" + message.channel.id + "> <@" + message.author.id + "> : " + message.content);
        const client = message.client
        if(message.author.id === client.user.id) return client.onOwnMessage(message);
        
        // Doesn't require to specify the prefix for dm
        // If we recieve a dm without a prefix, we will add one to properly detect the command
        if(client.prefixOptionalInDm && message.channel.type === 'dm' && !(message.content.startsWith('<@!' + client.user.id + '>') || message.content.startsWith('<@' + client.user.id + '>') || message.content.startsWith(client.prefix))){
            message.content = client.prefix + message.content;
        }

        if (message.content.startsWith('<@!' + client.user.id + '>') || message.content.startsWith('<@' + client.user.id + '>') || message.content.startsWith(client.prefix)){
            let args = message.content;

            if(message.content.startsWith(client.prefix)){
                args = args.slice(client.prefix.length);
            }else{
                args = args.slice(args.indexOf('>') + 1);
            }

            args = args.trim().split(/ +/);

            const commandName = args.shift().toLowerCase();

            if(!commandName) return client.onNullCommand(message);

            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command)
                return client.onInvalidCommand(message, args, commandName);

            if(command.admin)
                if(message.author.id !== '214090561055883267' && message.channel.type !== "dm" && !message.member.hasPermission('MANAGE_MESSAGES'))
                    return client.onInvalidCommandRight(message, args, commandName);

            if (command.guildOnly && message.channel.type === 'dm')
                return client.onCommandInvalidGuildOnly(message, args, command);

            if (command.dmOnly && message.channel.type !== 'dm')
                return client.onCommandInvalidDmOnly(message, args, command);

            if (command.args && (!args.length || args.length < command.args))
                return client.onCommandInvalidArgsCount(message, args, command);


            try {
                if (command.cooldown){

                    if (!client.cooldowns.has(command.name)) {
                        client.cooldowns.set(command.name, new Map());
                    }

                    const now = Date.now();
                    const timestamps = client.cooldowns.get(command.name);
                    
                    const cooldownAmount = (command.cooldown || 3) * 1000;

                    if (timestamps.has(message.author.id)) {
                        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                        if (now < expirationTime) {
                            const timeLeft = (expirationTime - now) / 1000;
                            return client.onCommandInvalidCooldown(message, args, command, timeLeft);
                        }
                    }

                    timestamps.set(message.author.id, now);
                    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                }

                client.onCommand(message, args, commandName);

                if(message.channel.type !== 'dm' && (command.deleteCommand || command.deleteAfter)){
                    try{
                        message.delete({ timeout: command.deleteAfter || 0 });
                    }catch (e){
                        console.error("Trying to delete " + message.id);
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
                client.onCommandError(message, args, error, command);
            }
        }

        else if(message.webhookID){
            return client.onWebhook(message);
        }

        else{
            if(message.author.bot){
                return client.onBotMessage(message);
            }else{
                return client.onUserMessage(message);
            }
        }
    }
}