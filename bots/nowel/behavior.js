const Inventory = require("../../inventory/inventory.js");
const Item = require("../../inventory/item.js");
const Nowalmanax = require("../../nowalmanax/nowalmanax");
const Drop = require("../../inventory/drop.js");
const Loot = require("../../inventory/loot.js");
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
        this.emojiFlocon = "780851275930533921";
        this.emojiFloconMagique = "780851276043780096";
        this.emojiFloconAlma = "780851275691589724";
    },

    async onceReady(){
        this.nowalmanax = new Nowalmanax(this);
        this.debbuger = await this.users.fetch("214090561055883267");
        const client = this;
        // noinspection ES6ShorthandObjectProperty
        cron.schedule('0 0 * * *', async function() {
            //Nowalmanax every midnight
            client.nowalmanax.advance();
        });

        // noinspection ES6ShorthandObjectProperty
        cron.schedule('* */2 * * *', async function() {
            //Auto save every two hours
            client.autoSave();
        });
        this.debbuger.send('Ready !').catch(e => console.log(e));
    },

    logError(err){
        this.debbuger.send("Error " + err).catch(e => console.log(e));
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
        }).catch(e => console.log(e));
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
        if(channel.dmChannel){
            channel = channel.dmChannel;
        }
        if(channel.type === "dm"){
            return this.inventory.getTrueItemOfUser(channel.recipient.id, 'language', 'fr');
        }else{
            return (['78581046714572800', '364081918116888576', '626165608010088449'].includes(channel.id))?"en":"fr";
        }
    },

    async onReaction(reaction, user) {
        // Attempting to open gift
        if (reaction.message.webhookID && reaction.emoji.name === '🎁') {
            const drop = Drop.getByName(reaction.message.author.username);
            if (drop === undefined) return;

            reaction.users.fetch().then(users => {
                console.log("Opening gift : " + users.size + ' VS ' + drop.min + ' (' + users.map(user => user.username + ' ') + ')');
                if (users.size >= drop.min) {
                    if (this.onGoingLoot.has(reaction.message.id)) {
                        return;
                    }
                    // noinspection JSIgnoredPromiseFromCall
                    reaction.message.react('🥁').catch(e => this.logError(e));
                    let timer = setTimeout(() => {
                        this.loot(reaction);
                    }, 5 * 1000);
                    this.onGoingLoot.set(reaction.message.id, timer);
                }

                if (users.size >= drop.max) {
                    if (this.onGoingLoot.has(reaction.message.id)) {
                        clearTimeout(this.onGoingLoot.get(reaction.message.id));
                    }
                    this.loot(reaction);
                }
            })
        }

        // Opening Nowalmanax gift
        else if (reaction.message.channel.type === 'dm' && reaction.emoji.name === '🎁') {
            reaction.users.fetch().then(users => {
                if (users.size > 1) {
                    reaction.users.remove(reaction.message.author.id).catch(err => this.logError(err));
                    const language = this.getLanguage(reaction.message.channel);
                    let embed = reaction.message.embeds[0];

                    let day = this.nowalmanax.day;

                    if(reaction.message.content.startsWith("Wow !")){
                        day = Number(embed.description.split(" - ", 1)[0]);
                    }

                    console.log('Day : ' + day);


                    let loot = {
                        "item": Item.get(this.nowalmanax.questItem),
                        "quantity": Math.ceil(day / 6)
                    };
                    let loot1 = Loot.getLootFromMetaLoot("common", 2);
                    let loot2 = Loot.getLootFromMetaLoot("common", 2);
                    let loot3 = Loot.getLootFromMetaLoot("common", 2);


                    this.inventory.addItemToUser(user.id, loot.item.id, loot.quantity);
                    this.inventory.addItemToUser(user.id, loot1.item.id, loot1.quantity);
                    this.inventory.addItemToUser(user.id, loot2.item.id, loot2.quantity);
                    this.inventory.addItemToUser(user.id, loot3.item.id, loot3.quantity);


                    embed.description = (day == 7?{
                            "fr": "**Deuxième semaine**\n",
                            "en": "**Second week**\n"
                        }[language]:'')
                        + (loot.quantity > 1 ? loot.quantity + 'x' : '') + loot.item.emoji + loot.item.name[language] + "\n"
                        + (loot1.quantity > 1 ? loot1.quantity + 'x' : '') + loot1.item.emoji + loot1.item.name[language] + "\n"
                        + (loot2.quantity > 1 ? loot2.quantity + 'x' : '') + loot2.item.emoji + loot2.item.name[language] + "\n"
                        + (loot3.quantity > 1 ? loot3.quantity + 'x' : '') + loot3.item.emoji + loot3.item.name[language]

                    // noinspection ES6MissingAwait,JSUnresolvedVariable
                    reaction.message.edit("", {
                        embed: embed,
                    });

                    if (!this.inventory.userHasItem(user.id, 'nowalmanax_help')) {
                        this.inventory.addItemToUser(user.id, 'nowalmanax_help');
                        user.send({
                            'fr': "Super, tu as capturé ton premier phorreur ! Chaque jour il est possible de trouver un phorreur différent. Tu peux voir si tu as déjà attrapé le tiens avec `" + this.prefix + "phorreur`.",
                            'en': "Nice, you caught your first drheller ! Each day you can catch a different drheller. You can check if you found it with `" + this.prefix + "drheller`.",
                        }[language]).catch(e => this.logError(e));
                    }
                }
            });
        }

        // Crafting
        else if (reaction.message.channel.type === 'dm' && reaction.emoji.name === '🛠️') {
            reaction.users.fetch().then(users => {
                if (users.size > 1) {
                    reaction.users.remove(reaction.message.author.id).catch(err => this.logError(err));
                    this.craft(reaction.message, user);
                }
            });
        }

        // Drop flocon
        else if (reaction.emoji.id === this.emojiFlocon) {
            console.log('Click on flocon');
            if (user.id === reaction.message.author.id) {
                await reaction.remove();
                this.inventory.addItemToUser(user.id, 'flocon');
            } else if(!user.bot){
                // noinspection ES6MissingAwait
                reaction.users.remove(user);
            }
        }

        // Drop flocon
        else if (reaction.emoji.id === this.emojiFloconMagique) {
            if (user.id === reaction.message.author.id) {
                await reaction.remove();
                this.inventory.addItemToUser(user.id, 'flocon_magique');
            } else if(!user.bot){
                // noinspection ES6MissingAwait
                reaction.users.remove(user);
            }
        }

        // Drop flocon nowalmanax
        else if (reaction.emoji.id === this.emojiFloconAlma) {
            if (user.id === reaction.message.author.id) {
                await reaction.remove();
                this.inventory.addItemToUser(user.id, 'nowalmanax_star');
            } else if(!user.bot){
                // noinspection ES6MissingAwait
                reaction.users.remove(user);
            }
        }

        else {
            if (this.inventory.userExists(user.id)) {
                this.nowalmanax.reactionValidateQuest(reaction, user);
            }
        }
    },

    onUserMessage(message){
        if(this.dropOn && this.dropChannels.includes(message.channel.id)){
            this.attemptDrop(message.channel);

            if(this.inventory.userHasItem(message.author.id, "drhellers_net"))
                this.nowalmanax.attemptNowalmanaxDrop(message);

            if(this.inventory.userHasItem(message.author.id, "quete1") && Math.random() < 0.005)
                this.dropFairy(message);

            if(this.inventory.userHasItem(message.author.id, "drop_flocon_1") && Math.random() < 0.10)
                message.react(this.emojiFlocon).catch(e => this.logError(e));
            if(this.inventory.userHasItem(message.author.id, "drop_flocon_2") && Math.random() < 0.05)
                message.react(this.emojiFloconMagique).catch(e => this.logError(e));
            if(this.inventory.userHasItem(message.author.id, "drop_flocon_3") && Math.random() < 0.02)
                message.react(this.emojiFloconAlma).catch(e => this.logError(e));
        }
    },

    onWebhook(message){
        if(Drop.getByName(message.author.username) !== undefined){
            // noinspection JSIgnoredPromiseFromCall
            message.react('🎁').catch(e => this.logError(e));
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
        this.sendWebhook(channel, {
            "content": drop.description[language],
            "username": drop.title[language],
            "avatar_url": drop.image || Drop.getGift()
        });
    },

    dropFairy(message){

    },

    checkFairyDrop(reaction, user){
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
            user.send(recipe.craftMessage[language], {files: [recipe.craftMessageLink]}).catch(e => this.logError(e));
        }
        else if(recipe.craftMessage){
            user.send(recipe.craftMessage[language]).catch(e => this.logError(e));
        }
    },

    async loot(reaction){
        const language = this.getLanguage(reaction.message.channel);

        let messages = await reaction.message.channel.messages.fetch({ limit: 10 })
        let users = await reaction.users.fetch();
        console.log("Looting gift : " + users.map(user => user.username + ' '));
        users.delete(this.user.id);

        let bonus = 1 + users.size/4; // 25% de bonus par joueur participants

        let badges = new Map();
        let ownBonus = new Map();

        for(let user of users.values()){

            if(!user.bot && !this.inventory.userExists(user.id)){
                this.greet(user, language);
            }

            if(this.inventory.userHasItem(user.id, 'booster1')){
                badges.set(user.id, '<:etoile:780851276094767104>');
                bonus += 0.25;
            }

            if(this.inventory.userHasItem(user.id, 'booster2')){
                badges.set(user.id, '<:etoile:780851276094767104>');
                bonus += 0.75;
            }

            if(this.inventory.userHasItem(user.id, 'booster3')){
                badges.set(user.id, '<:etoile:780851276094767104>');
                bonus += 1.75;
            }

            let bad_karmas = 1;
            for(let message of messages.values()){
                if(message.author.id === user.id){
                    bad_karmas = -5;
                    break;
                }
            }

            bad_karmas = this.inventory.safeAddItemToUser(user.id, 'bad_karma', bad_karmas);

            if(bad_karmas >= 10){
                ownBonus.set(user.id, 0.1);
                badges.set(user.id, '❗');
            }
        }

        let loot = Loot.getLoot(bonus, bonus);

        for(let user of users.values()){
            this.inventory.addItemToUser(user.id, loot.item.id, loot.quantity * (ownBonus.has(user.id)?ownBonus.get(user.id):1));
        }

        this.editWebhook(reaction.message.channel, {
            "content": loot.meta_loot.name[language] + " **" + (loot.quantity>1?loot.quantity + 'x':'') + loot.item.emoji + loot.item.name[language] + "**! Bravo" + users.map(user => ' ' + (badges.has(user.id)?badges.get(user.id):"") + user.username)
        }, reaction.message.id);

        // noinspection ES6MissingAwait
        reaction.message.reactions.removeAll();

    },

    greet(user, language){
        user.send(
            {
                'fr':
                    'Salut ! Je suis Pikpik, le Sapik de Nowel.\n' +
                    'Comme tu peux le voir, la fin de l\'année approche ! Il y a plein de trucs à faire, et on a besoin de toi ;)\n',
                'en':
                    "Hey ! I'm Pikpik !\n" +
                    "It is Kwismas ! There is plenty of things to do, and we need you !"
            }[language],
            {
                files: ["https://cdn.discordapp.com/attachments/781503539142459452/781937867277860894/Nowel.png"]
            }).then(msg => {
            msg.channel.send(
                {
                    'fr':
                        'Voyons les crafts : `' + this.prefix + 'craft`\n*🇬🇧 `' + this.prefix + 'english`*',
                    'en':
                        "Let's check what we can craft `" + this.prefix + "craft` \n*🇨🇵 `" + this.prefix + "francais`*"
                }[language]);
        }).catch(e => this.logError(e));

        this.inventory.addItemToUser(user.id, 'quest0_available');
        this.inventory.addItemToUser(user.id, 'boule_verte', 2);
        this.inventory.setItemToUser(user.id, 'language', language);
    },

    sendInventory(user, channel, flags = false, list = false) {
        const language = this.getLanguage(user);
        const inventory = this.getInventory(user, language, flags, list);

        if(channel.type === "dm"){
            channel.send('', {
                embed: inventory.embeds[0]
            }).catch(e => this.logError(e));
        }
        else{
            this.sendWebhook(channel, inventory);
        }
    },

    getInventory(user, language = "fr", flags = false, list = false){
        const inventory = this.inventory.getInventoryOfUser(user.id);

        let webhook = {
            "username": {
                "fr": "Inventaire",
                "en": "Inventory"
            }[language],
            "avatar_url": "https://cdn.discordapp.com/attachments/770768439773888532/775420082285183036/icon__0027_Inventaire.png",
            "embeds": [
                {
                    "description": "",
                    "author": {
                        "name": user.username,
                        "icon_url": user.avatarURL()
                    },
                    "fields": []
                }
            ]
        };

        if(!inventory){
            webhook.embeds[0].description = {
                "fr": "Inventaire vide",
                "en": "Empty inventory"
            }[language];
            return webhook;
        }

        for(let category of Object.keys(inventory)){
            let text = "";

            if(!flags && inventory[category].hideInInventory) continue;

            for(let item of inventory[category].items){
                if(item.quantity !== 0) {
                    if (list || inventory[category].displayFullNameInInventory) {
                        text += (item.emoji?item.emoji:'') + item.name[language] + (item.quantity !== 1 ? ' (' + item.quantity + ')' : '') + "\n";
                    } else {
                        text += item.emoji + " : " + item.quantity + "\n";
                    }
                }
            }

            if(text !== ""){
                webhook.embeds[0].fields.push({
                    "name": inventory[category].name[language],
                    "inline": true,
                    "value": text
                })
            }
        }
        return webhook;
    },

};