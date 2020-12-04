const Inventory = require("../../inventory/inventory.js");
const Nowalmanax = require("../../nowalmanax/nowalmanax");
const Drop = require("../../inventory/drop.js");
const Craft = require("../../inventory/craft.js");
const cron = require('node-cron');

// noinspection JSUnusedLocalSymbols
module.exports = {
    setup() {
        this.inventory = new Inventory(this);
        this.items = require('../../inventory/items.json');
        this.onGoingLoot = new Map();
        this.dropOn = false;

        this.messageSinceLastDrop = 0;
        this.autoSaveCount = 1;
        this.dropChannels = [
            '780756123522301962',
            '780171576381276231',
            '774531283426213898',
            '78581046714572800',
            '364081918116888576',
            '626165608010088449',
            '297779639609327617',
            '364086525799038976',
            '626165637252907045'
        ];
    },

    async onceReady(){
        this.nowalmanax = new Nowalmanax(this);
        this.debbuger = await this.users.fetch("214090561055883267");

        // noinspection ES6ShorthandObjectProperty
        cron.schedule('0 0 * * *', async function() {
            //Nowalmanax every midnight
            this.nowalmanax.advance();
        });

        // noinspection ES6ShorthandObjectProperty
        cron.schedule('0 */2 * * *', async function() {
            //Nowalmanax every 2 hours
            this.autoSave();
        });
        this.debbuger.send('Ready !');
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
                }else{
                    this.logError("Bon fetch sur " + userId + " (bu lu comme " + user.id + ") " + txt)
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
            return this.inventory.getTrueItemOfUser(channel.recipient.id, 'language', 'fr');
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
                    if(this.onGoingLoot.has(reaction.message.id)){
                        return;
                    }
                    // noinspection JSIgnoredPromiseFromCall
                    reaction.message.react('🥁');
                    let timer = setTimeout(() => {
                        this.execute('loot_reaction', reaction   );
                    }, 5*1000);
                    this.onGoingLoot.set(reaction.message.id, timer);
                }

                if(users.size >= drop.max){
                    if(this.onGoingLoot.has(reaction.message.id)) {
                        clearTimeout(this.onGoingLoot.get(reaction.message.id));
                    }
                    this.execute('loot_reaction', reaction);
                }
            })
        }
        else if(reaction.message.channel.type === 'dm' && reaction.emoji.name === '🎁') {
            reaction.users.fetch().then(users => {
                if(users.size > 1) {
                    reaction.users.remove(reaction.message.author.id).catch(err => this.logError(err));
                    this.execute('loot_nowalmanax', reaction, user);
                }
            });
        }

        else if(reaction.message.channel.type === 'dm' && reaction.emoji.name === '🛠️') {
            reaction.users.fetch().then(users => {
                if(users.size > 1) {
                    reaction.users.remove(reaction.message.author.id).catch(err => this.logError(err));
                    this.craft(reaction.message, user);
                }
            });
        }

        else {
            if(this.inventory.userExists(user.id)){
                this.nowalmanax.reactionValidateQuest(reaction, user);
                this.execute('check_fairy_drop', reaction, user);
            }
        }
    },

    onUserMessage(message){
        if(this.dropChannels.includes(message.channel.id)){
            this.attemptDrop(message.channel);
            if(this.inventory.userHasItem(message.author.id, "drhellers_net")) {
                this.nowalmanax.attemptNowalmanaxDrop(message);
            }
            if(this.inventory.userHasItem(message.author.id, "quete1")) {
                this.attemptFairy(message);
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
            "fr": 'Si tu as besoin d\'aide, n\'hésite pas à utiliser `' + this.prefix + 'help` :wink:',
            "en": 'If you need help, you can use `' + this.prefix + 'help` :wink:'
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));
    },

    onInvalidCommand(message, args, commandName){
        if(message.channel.type === "dm") return;

        message.reply({
            "fr": 'La commande `' + commandName + '` n\'existe pas... (voir `' + this.prefix + 'help`)',
            "en": 'The command `' + commandName + '` doesn\'t exist ... (see `' + this.prefix + 'help`)'
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));
    },

    onCommandError(message, args, error, command){
        message.reply({
            "fr": 'Une tempête de neige a perturbé `' + command.name + '` qui a échoué...',
            "en": 'A snowstorm interrupted`' + command.name + '`...'
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));

        this.logErrorMsg(error, message);
    },

    onCommandInvalidGuildOnly(message, args, command){
        message.reply({
            "fr": 'La commande `' + command.name + '` ne marche pas en message privé',
            "en": 'The command `' + command.name + '` doesn\'t work for DM'
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));
    },

    onInvalidCommandRight(message, args, command){
        this.onInvalidCommand(message, args, command);
    },

    onCommandInvalidDmOnly(message, args, command){
        message.reply({
            "fr": 'La commande `' + commandName + '` ne marche qu\'en message privé',
            "en": 'The command `' + commandName + '` only work for DMs. You can slide in my DMs :wink:'
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));
    },

    onCommandInvalidArgsCount(message, args, command){
        message.reply({
            "fr": '`' + command.name + '` nécessite au moins ' + command.args + ' arguments ',
            "en": '`' + command.name + '` require at least ' + command.args + ' arguments '
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));
    },

    onCommandInvalidCooldown(message, args, command, timeLeft){
        message.reply({
            "fr": 'Il faut attendre encore `' + timeLeft + '` secondes avant de pouvoir réutiliser `' + command.name + '`',
            "en": 'You have to wait `' + timeLeft + '` seconds before using `' + command.name + '` again'
        }[this.getLanguage(message.channel)])
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
            .catch(err => this.logErrorMsg(err, message));
    },

    attemptDrop(channel){
        if(!this.dropOn) return;

        let nb = Math.random() * Math.max(1, 1 + (2 * (5 - this.messageSinceLastDrop)));
        console.log(nb);
        if(nb < 0.05){
            this.drop(channel);
            this.messageSinceLastDrop = 0;
        }else{
            this.messageSinceLastDrop++;
        }
    },

    drop(channel){
        const language = this.getLanguage(channel);
        const drop = Drop.getDrop();
        // noinspection JSIgnoredPromiseFromCall
        this.sendWebhook(message.channel, {
            "content": drop.description[language],
            "username": drop.title[language],
            "avatar_url": drop.image || Drop.getGift()
        });
    },

    attemptFairy(message){
    },

    autoSave(){
        this.autoSaveCount += 1;
        let filename = "auto_save_" + this.autoSaveCount;
        this.inventory.export(filename);
        this.nowalmanax.export(filename);
    },

    craft(message, user){
        const language = this.getLanguage(user);

        const recipe = Craft.getRecipeFromName(message.embeds[0].title);
        this.inventory.addItemToUser(user.id, recipe.result);

        for(let ingredient of recipe.recipe){
            this.inventory.addItemToUser(user.id, ingredient[0], -ingredient[1]);
        }

        if(recipe.craftRemoveFlag){
            this.inventory.addItemToUser(user.id, recipe.craftRemoveFlag, -1);
        }
        if(recipe.craftAddFlag){
            this.inventory.addItemToUser(user.id, recipe.craftAddFlag, 1);
        }

        this.inventory.addItemToUser(user.id, recipe.craftBonus, recipe.craftBonusQuantity);

        const bonusItem = Item.get(recipe.craftBonus);

        message.embeds[0].description = {
            "fr": "Bonus de fabrication ",
            "en": "Craft bonus"
        }[language] + ": + " + recipe.craftBonusQuantity + ' ' + bonusItem.emoji + ' ' + bonusItem.name[language] + "\n" + recipe.craftSucces[language];

        // noinspection ES6MissingAwait
        message.edit("", {
            embed: message.embeds[0],
        });

        if(recipe.craftMessageLink){
            user.send(recipe.craftMessage[language], {files: [recipe.craftMessageLink]});
        }
        else if(recipe.craftMessage){
            user.send(recipe.craftMessage[language]);
        }
    }

};