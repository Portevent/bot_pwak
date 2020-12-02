const Inventory = require("../../inventory/inventory.js");
const Nowalmanax = require("../../nowalmanax/nowalmanax");
const Drop = require("../../inventory/drop.js");
const cron = require('node-cron');

// noinspection JSUnusedLocalSymbols
module.exports = {
    setup(client) {
        client.inventory = new Inventory(client);
        client.drop_params = require('../../inventory/drop.json');
        client.items = require('../../inventory/items.json');
        client.onGoingLoot = new Map();
        client.dropOn = false;

        client.messageSinceLastDrop = 0;
        client.autoSaveCount = 1;
    },

    async onceReady(client){
        client.nowalmanax = new Nowalmanax(client);
        client.debbuger = await client.users.fetch("214090561055883267");

        cron.schedule('0 0 * * *', async function() {
            //Nowalmanax every midnight
            client.nowalmanax.advance();
        });

        cron.schedule('0 */2 * * *', async function() {
            //Nowalmanax every 2 hours
            client.execute('auto_save', client);
        });
        client.debbuger.send('Ready !');
    },

    logError(err){
        this.debbuger.send("Error " + err);
    },

    logErrorMsg(err, msg){
        this.debbuger.send("Error " + err, {
            embed: {
                "description": msg.content,
                "author": {
                    "name": msg.author.username + "(" + msg.author.id + ")",
                    "icon_url": msg.author.avatarURL()
                },
                "footer": {
                    "text": "Sent in <#" + msg.channel.id + "> " + (msg.channel.type === "dm"?"(DM " + msg.channel.recipient.username + "":''),
                    "icon_url": (msg.channel.type === "dm"?msg.channel.recipient.avatarURL():''),
                }
            }
        });
    },

    async check(userId, txt = ""){
        await this.users.fetch(userId, true, true).then(user => {
            if(user){
                if(user.id !== userId){
                    this.logError("Mauvais fetch sur " + userId + " (considéré comme " + user.id + ") " + txt);
                }
            }else{
                this.logError("Can't fetch " + userId);
            }
        }).catch(
            err => this.logError(err)
        );
    },

    getLanguage(channel){
        if(channel.type === "dm"){
            return channel.client.inventory.getTrueItemOfUser(channel.recipient.id, 'language', 'fr');
        }else{
            return (['78581046714572800', '364081918116888576', '626165608010088449'].includes(channel.id))?"en":"fr";
        }
    },

    onReaction(reaction, user){
        if(reaction.message.webhookID && reaction.emoji.name === '🎁'){
            const drop = Drop.getByName(reaction.message.author.username);

            reaction.users.fetch().then(users => {
                console.log("Opening gift : " + users.size + ' VS ' + drop.min + ' (' + users.map(user => user.username + ' ') + ')');
                if(users.size >= drop.min){
                    if(reaction.message.client.onGoingLoot.has(reaction.message.id)){
                        return;
                    }
                    // noinspection JSIgnoredPromiseFromCall
                    reaction.message.react('🥁');
                    let timer = setTimeout(() => {
                        reaction.message.client.execute('loot_reaction', reaction   );
                    }, 5*1000);
                    reaction.message.client.onGoingLoot.set(reaction.message.id, timer);
                }

                if(users.size >= drop.max){
                    if(reaction.message.client.onGoingLoot.has(reaction.message.id)) {
                        clearTimeout(reaction.message.client.onGoingLoot.get(reaction.message.id));
                    }
                    reaction.message.client.execute('loot_reaction', reaction);
                }
            })
        }
        else if(reaction.message.channel.type === 'dm' && reaction.emoji.name === '🎁') {
            reaction.users.fetch().then(users => {
                if(users.size > 1) {
                    reaction.users.remove(reaction.message.author.id);
                    reaction.message.client.execute('loot_nowalmanax', reaction, user);
                }
            });
        }

        else if(reaction.message.channel.type === 'dm' && reaction.emoji.name === '🛠️') {
            reaction.users.fetch().then(users => {
                if(users.size > 1) {
                    reaction.users.remove(reaction.message.author.id);
                    reaction.message.client.execute('craft_reaction', reaction, user);
                }
            });
        }

        else {
            if(reaction.message.client.inventory.userExists(user.id)){
                reaction.message.client.nowalmanax.reactionValidateQuest(reaction, user);
                reaction.message.client.execute('check_fairy_drop', reaction, user);
            }
        }
    },

    onUserMessage(message){
        if(['780756123522301962', '780171576381276231', '774531283426213898', '78581046714572800', '364081918116888576', '626165608010088449', '297779639609327617', '364086525799038976', '626165637252907045'].includes(message.channel.id)){
            message.client.execute('attempt_drop', message, []);
            if(message.client.inventory.userHasItem(message.author.id, "drhellers_net")) {
                message.client.nowalmanax.attemptNowalmanaxDrop(message);
            }
            if(message.client.inventory.userHasItem(message.author.id, "quete1")) {
                message.client.execute('attempt_fairy_drop', message, []);
            }
        }
    },

    onWebhook(message){
        if(Drop.getByName(message.author.username) !== undefined){
            // noinspection JSIgnoredPromiseFromCall
            message.react('🎁');
        }
    },



    onNullCommand(message){
        message.reply({
            "fr": 'Si tu as besoin d\'aide, n\'hésite pas à utiliser `' + message.client.prefix + 'help` :wink:',
            "en": 'If you need help, you can use `' + message.client.prefix + 'help` :wink:'
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));
    },

    onInvalidCommand(message, args, commandName){
        if(message.channel.type === "dm") return;

        message.reply({
            "fr": 'La commande `' + commandName + '` n\'existe pas... (voir `' + message.client.prefix + 'help`)',
            "en": 'The command `' + commandName + '` doesn\'t exist ... (see `' + message.client.prefix + 'help`)'
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));
    },

    onCommandError(message, args, error, command){
        message.reply({
            "fr": 'Une tempête de neige a perturbé `' + command.name + '` qui a échoué...',
            "en": 'A snowstorm interrupted`' + command.name + '`...'
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));

        message.client.logErrorMsg(error, message);
    },

    onCommandInvalidGuildOnly(message, args, command){
        message.reply({
            "fr": 'La commande `' + command.name + '` ne marche pas en message privé',
            "en": 'The command `' + command.name + '` doesn\'t work for DM'
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));
    },

    onInvalidCommandRight(message, args, command){
        message.client.onInvalidCommand(message, args, command);
    },

    onCommandInvalidDmOnly(message, args, command){
        message.reply({
            "fr": 'La commande `' + commandName + '` ne marche qu\'en message privé',
            "en": 'The command `' + commandName + '` only work for DMs. You can slide in my DMs :wink:'
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));
    },

    onCommandInvalidArgsCount(message, args, command){
        message.reply({
            "fr": '`' + command.name + '` nécessite au moins ' + command.args + ' arguments ',
            "en": '`' + command.name + '` require at least ' + command.args + ' arguments '
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));
    },

    onCommandInvalidCooldown(message, args, command, timeLeft){
        message.reply({
            "fr": 'Il faut attendre encore `' + timeLeft + '` secondes avant de pouvoir réutiliser `' + command.name + '`',
            "en": 'You have to wait `' + timeLeft + '` seconds before using `' + command.name + '` again'
        }[message.client.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => message.client.logErrorMsg(err, message));
    },
};