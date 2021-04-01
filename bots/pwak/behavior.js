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
        this.onGoingTempLoot = new Map();
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

        this.englishChannels = [
            '78581046714572800',
            '364081918116888576',
            '626165608010088449',
            '297780920268750858'
        ];

        this.debug = true;
    },

    async onceReady(){
        this.nowalmanax = new Nowalmanax(this);
        this.debbuger = await this.users.fetch("214090561055883267");
        if(this.debug){
            this.offTopics = {// Test
                fr: await this.channels.fetch('774531283426213898'),
                en: await this.channels.fetch('774531283426213898')
            };
        }else{
            this.offTopics = { // Discord Dofus
                fr: await this.channels.fetch('372100313890553856'),
                en: await this.channels.fetch('297780920268750858')
            };
        }
        if(this.debug){
            this.announces = {// Test
                fr: await this.channels.fetch('780171576381276231'),
                en: await this.channels.fetch('780756123522301962')
            };
        }else{
            this.announces = { // Discord Dofus
                fr: await this.channels.fetch('356039693332381696'),
                en: await this.channels.fetch('297780078245576704')
            };
        }
        if(this.debug){
            this.referenceGuild = await this.guilds.fetch("606832838532399125"); // Test
        }else{
            this.referenceGuild = await this.guilds.fetch("78581046714572800"); // Discord Dofus
        }

        const client = this;

        // noinspection ES6ShorthandObjectProperty
        // cron.schedule('0 23 * * *', async function() {
        //     //End of the event
        //     this.end(announces["fr"], announces["en"]);
        // });
        /*
        // noinspection ES6ShorthandObjectProperty
        cron.schedule('0 0 * * *', async function() {
            //Nowalmanax every midnight
            client.nowalmanax.advance();
        });
        */

        // noinspection ES6ShorthandObjectProperty
        cron.schedule('*/30 * * * *', async function() {
            //Auto save every 30 minutes
            client.autoSave();
        });

        this.debbuger.send('Ready !').catch(e => console.log(e));
    },

    logError(err){
        this.debbuger.send(err.toString()).catch(e => console.log(e));
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
                    "text": "Sent in <#" + msg.channel.id + "> " + (msg.channel.type === "dm"?"(DM " + msg.channel.recipient.username + ")":''),
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
        // User passed as channel
        if(channel.dmChannel){
            return this.inventory.getTrueItemOfUser(channel.id, 'language', 'fr');
        }
        // DM Channel
        else if(channel.type === "dm"){
            return this.inventory.getTrueItemOfUser(channel.recipient.id, 'language', 'fr');
        }
        //Public channel
        else{
            return (this.englishChannels.includes(channel.id))?"en":"fr";
        }
    },

    async onReaction(reaction, user) {
        // Attempting to open gift
        if (reaction.message.webhookID) {
            if (reaction.emoji.name === '🍫') {
                const drop = Drop.getByName(reaction.message.author.username);
                if (drop === undefined) return;

                reaction.users.fetch().then(users => {
                    //console.log("Opening gift : " + users.size + ' VS ' + drop.min + ' (' + users.map(user => user.username + ' ') + ')');
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
        }

        // Opening Nowalmanax gift
        else if (reaction.message.channel.type === 'dm' && reaction.emoji.name === '🍫') {
            reaction.users.fetch().then(users => {
                if (users.size > 1) {
                    reaction.users.remove(reaction.message.author.id).catch(err => this.logError(err));
                    const language = this.getLanguage(reaction.message.channel);
                    let embed = reaction.message.embeds[0];

                    let loot = {
                        "item": Item.get(this.nowalmanax.questItem),
                        "quantity": 1
                    };
                    let loot1 = Loot.getLootFromMetaLoot("common", 2);
                    let loot2 = Loot.getLootFromMetaLoot("common", 2);


                    this.inventory.addItemToUser(user.id, loot.item.id, loot.quantity);
                    this.inventory.addItemToUser(user.id, loot1.item.id, loot1.quantity);
                    this.inventory.addItemToUser(user.id, loot2.item.id, loot2.quantity);


                    embed.description = (loot.quantity > 1 ? loot.quantity + 'x' : '') + loot.item.emoji + loot.item.name[language] + "\n"
                        + (loot1.quantity > 1 ? loot1.quantity + 'x' : '') + loot1.item.emoji + loot1.item.name[language] + "\n"
                        + (loot2.quantity > 1 ? loot2.quantity + 'x' : '') + loot2.item.emoji + loot2.item.name[language]

                    // noinspection ES6MissingAwait,JSUnresolvedVariable
                    reaction.message.edit("", {
                        embed: embed,
                    });

                    if (!this.inventory.userHasItem(user.id, 'nowalmanax_help')) {
                        this.inventory.addItemToUser(user.id, 'nowalmanax_help');
                        user.send({
                            'fr': "Super, tu as capturé ton premier Wabbit de Pwâk ! Chaque jour il est possible de trouver un Wabbit différent. Tu peux voir si tu as déjà attrapé le tiens avec `" + this.prefix + "wabbit`.",
                                'en': "Nice, you caught your first Fleaster's Wabbit ! Each day you can catch a different Wabbit. You can check if you found it with `" + this.prefix + "wabbit`.",
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
        }
    },

    onBotMessage(message){
        this.onUserMessage(message);
    },

    onWebhook(message){
        if(Drop.getByName(message.author.username) !== undefined){
            // noinspection JSIgnoredPromiseFromCall
            message.react('🍫').catch(e => this.logError(e));
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
            "fr": 'Un wabbit sauvage perturbé `' + command.name + '` qui a échoué...',
            "en": 'A wild wabbit interrupted`' + command.name + '`...'
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
        if(nb < 0.23){
            this.drop(channel);
            this.messageSinceLastDrop = 0;
        }else{
            console.log("Failed drop : " + nb);
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

    autoSave(){
        this.autoSaveCount += 1;
        let filename = "auto_save_" + this.autoSaveCount;
        this.inventory.export(filename);
        this.nowalmanax.export(filename);
    },

    craft(message, user){
        const language = this.getLanguage(user);

        const recipe = Craft.getRecipeFromName(message.embeds[0].title);

        for(let ingredient of recipe.recipe){
            if(this.inventory.getItemOfUser(user.id, ingredient[0]) < ingredient[1]){
                return;
            }
        }

        this.inventory.addItemToUser(user.id, recipe.result);

        message.embeds[0].description = recipe.craftSucces[language];

        // noinspection ES6MissingAwait
        message.edit("", {
            embed: message.embeds[0],
        });

        if(recipe.craftMessage){
            user.send(recipe.craftMessage[language]).catch(e => this.logError(e));
        }
    },

    async loot(reaction){
        const language = this.getLanguage(reaction.message.channel);

        let messages = await reaction.message.channel.messages.fetch({ limit: 10 })
        let users = await reaction.users.fetch();
        //console.log("Looting gift : " + users.map(user => user.username + ' '));
        users.delete(this.user.id);

        let bonus = 1 + users.size/4; // 25% de bonus par joueur participants
        let seccond_bonus = 0;

        let badges = new Map();
        let ownBonus = new Map();

        for(let user of users.values()){

            if(!user.bot && !this.inventory.userExists(user.id)){
                this.greet(user, language);
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
        let loot2 = Loot.getLootFromMetaLoot(loot.meta_loot.id, bonus*seccond_bonus);

        for(let user of users.values()){
            this.inventory.addItemToUser(user.id, loot.item.id, Math.floor(loot.quantity * (ownBonus.has(user.id)?ownBonus.get(user.id):1)));
            this.inventory.addItemToUser(user.id, loot2.item.id, Math.floor(loot2.quantity * (ownBonus.has(user.id)?ownBonus.get(user.id):1)));
        }

        this.editWebhook(reaction.message.channel, {
            "content": loot.meta_loot.name[language] + " **" + (loot.quantity>1?loot.quantity + 'x':'') + loot.item.emoji + loot.item.name[language] + "**"
                + (seccond_bonus > 0?"\n**" + (loot2.quantity>1?loot2.quantity + 'x':'') + loot2.item.emoji + loot2.item.name[language] + "**" :"")
                + "! Bravo" + users.map(user => ' ' + (badges.has(user.id)?badges.get(user.id):"") + user.username)
        }, reaction.message.id);

        // noinspection ES6MissingAwait
        reaction.message.reactions.removeAll();

    },

    greet(user, language){
        user.send(
            {
                'fr':
                    'Salut ! Je suis Choco Wa, le Wabbit de Pwak.\n' +
                    'Comme tu peux le voir, les cloches de Pwak sont passées ! Il y a plein de trucs à faire, et on a besoin de toi ;)\n',
                'en':
                    "Hey ! I'm Choco Wa, the Fleaster Wabbit !\n" +
                    "It is Fleaster ! There is plenty of things to do, and we need you !"
            }[language]).then(msg => {
            msg.channel.send(
                {
                    'fr':
                        'Voyons les crafts : `' + this.prefix + 'craft`\n*🇬🇧 `' + this.prefix + 'english`*',
                    'en':
                        "Let's check what we can craft `" + this.prefix + "craft` \n*🇨🇵 `" + this.prefix + "francais`*"
                }[language]);
        }).catch(e => {
            this.logError(e);
            this.logError(user);
            this.logError(user.username);
        });

        this.inventory.addItemToUser(user.id, 'choco', 2);
        this.inventory.setItemToUser(user.id, 'language', language);
    },

    sendInventory(user, channel, flags = false, list = false) {
        const language = this.getLanguage(channel);
        const inventory = this.getInventory(user, language, flags, list);

        if(channel.dmChannel){
            channel.send('', {
                embed: inventory.embeds[0]
            }).catch(e => this.logError(e));
        }
        else if(channel.type === "dm"){
            channel.send('', {
                embed: inventory.embeds[0]
            }).catch(e => this.logError(e));
        }
        else{
            this.sendWebhook(this.offTopics[language], inventory);
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
            let textIfNotEmpty = "";
            let empty = true;

            if(!flags && inventory[category].hideInInventory) continue;

            for(let item of inventory[category].items){
                if(item.quantity !== 0) {
                    if(!item.inline){
                        text += "\n";
                    }

                    empty = false;
                    if (list || inventory[category].displayFullNameInInventory || item.displayFullNameInInventory) {
                        text += (item.emoji?item.emoji:'') + (item.short_name?item.short_name[language]:item.name[language]) + (item.quantity !== 1 ? ' (' + item.quantity + ')' : '');
                    } else if(item.emojiOnlyInInventory){
                        text += item.emoji + " ";
                    } else {
                        text += item.emoji + " : " + item.quantity;
                    }
                }else if(item.emojiIfEmpty){
                    if(empty){
                        if(!item.inline){
                            textIfNotEmpty += "\n";
                        }

                        textIfNotEmpty += item.emojiIfEmpty;
                    }

                    else{
                        if(!item.inline){
                            text += "\n";
                        }

                        text += item.emojiIfEmpty;

                    }
                }
            }

            if(!empty){
                webhook.embeds[0].fields.push({
                    "name": inventory[category].name[language],
                    "inline": true,
                    "value": textIfNotEmpty + text
                })
            }
        }
        return webhook;
    },

    async end(channelFr, channelEn){
        this.inventory.export("save");

        this.debbuger.send("Last save", {
            files: [
                "./inventory/saves/save.json"
            ]
        });
        let leaderboard = [];
        let i = 0;
        let j = 0;
        const inventory = this.inventory;

        this.dropOn = false;

        let items = {
            boule_rouge: 0,
            boule_orange: 0,
            boule_jaune: 0,
            boule_verte: 0,
            boule_bleue: 0,
            boule_violette: 0,
            boule_multi: 0,
            newline: 0,
            kamas_or: 0,
            kamas_argent: 0,
            kamas_bronze: 0,
            nowalmanax_star: 0,
        }
        
        let decraft = {
            nowalmanax_star: {
                nowalmanax_star: 1,
            },
            kamas_bronze: {
                kamas_bronze: 1,
            },
            kamas_argent: {
                kamas_argent: 1,
            },
            kamas_or: {
                kamas_or: 1,
            },
            boule_rouge: {
                boule_rouge : 1,
            },
            boule_orange: {
                boule_orange : 1,
            },
            boule_jaune: {
                boule_jaune : 1,
            },
            boule_verte: {
                boule_verte : 1,
            },
            boule_bleue: {
                boule_bleue : 1,
            },
            boule_violette: {
                boule_violette : 1,
            },
            boule_multi: {
                boule_multi : 1,
            },
            drhellers_net: {
                boule_verte : 2,
            },
            process: {
                boule_rouge : 1,
                boule_violette : 1,
            },
            machine: {
                boule_rouge : 3,
                boule_jaune : 1,
                boule_verte : 4,
                boule_bleue : 1,
                boule_violette : 1,
            },
            soufle: {
                boule_rouge : 3,
                boule_orange : 10,
                boule_jaune : 8,
                boule_verte : 9,
                boule_bleue : 10,
                boule_violette : 6,
            },
            quete1: {
                nowalmanax_star : 10,
            },
            drop_flocon_1: {
                boule_rouge: 37,
                boule_bleue: 28,
                boule_violette: 19,
            },
            drop_flocon_2: {
                boule_rouge: 37,
                boule_bleue: 136,
                boule_violette: 234,
            },
            recycleur1: {
                boule_orange : 87,
                boule_verte : 48,
                boule_violette : 68
            },
            recycleur2: {
                boule_orange : 87,
                boule_jaune : 68,
                boule_verte : 98,
                boule_violette : 110
            },
            invspy: {
                boule_bleue : 42,
                boule_orange : 27,
                boule_verte : 38,
                boule_violette : 29,
                boule_jaune : 33
            },
            ladder: {
                boule_violette : 49,
                boule_jaune :61,
                boule_bleue :5,
                boule_rouge : 68,
                boule_orange : 76
            },
            quete2: {
                nowalmanax_star :12,
                boule_bleue :41,
                boule_rouge :38,
                boule_violette :54,
                boule_orange :56,
                boule_jaune :61
            },
            quete3: {
                nowalmanax_star :32,
                boule_bleue :71,
                boule_rouge :108,
                boule_violette :98,
                boule_orange :56,
                boule_jaune :99
            },
            bonus_drop: {
                boule_multi : 1,
                boule_violette : 13,
                boule_bleue : 13,
                boule_jaune : 13
            },
            bonus_big_drop: {
                boule_multi : 4,
                boule_violette : 13,
                boule_bleue : 13,
                boule_jaune : 13
            },
            bonus_double_drop: {
                boule_multi : 9,
                boule_violette : 13,
                boule_bleue : 13,
                boule_jaune : 13
            },
            bonus_double_drop_plus: {
                boule_multi : 29,
                boule_violette : 13,
                boule_bleue : 13,
                boule_jaune : 13
            }
        }

        //console.log(inventory.inventory.keys());
        for(let userId of this.inventory.inventory.keys()){
            j++;
            //console.log(userId + ' : 1 ' + j + '/' + inventory.inventory.size);
            if(!this.inventory.userHasItem(userId, 'banned')){
                let member = await this.referenceGuild.members.fetch(userId).catch(e => {});
                let user;
                let name = userId;
                //console.log(userId + ' : 1.5 ' + j + '/' + inventory.inventory.size);
                if(!member) {
                    user = await this.users.fetch(userId).catch(e => {});
                    name = user.username;
                }else{
                    user = member.user;
                    name = member.nickname || user.username;
                }


                let current = {
                    id: user.id,
                    name: name,
                    or: this.inventory.getItemOfUser(user.id, 'kamas_or'),
                    argent: this.inventory.getItemOfUser(user.id, 'kamas_argent'),
                }
                
                // Position dans le ladder
                if(leaderboard.length === 0){
                    leaderboard = [current];
                }else{
                    for(i = 0; i < leaderboard.length; i++){
                        //console.log(' (' + leaderboard[i].or + ' / ' + leaderboard[i].argent + ') VS (' + current.or + ' / ' + current.argent + ')')
                        if(leaderboard[i].or < current.or || (leaderboard[i].or === current.or && leaderboard[i].argent < current.argent)){
                            //console.log('Breaking ' + current.id + " on " + i + "/" + leaderboard.length);
                            break;
                        }
                    }
                    leaderboard.splice(i, 0, current);
                }

                let count;
                for (let craft in decraft){
                    count = this.inventory.getItemOfUser(user.id, craft);
                    if(count > 0){
                        for (let item in decraft[craft]){
                            items[item] += decraft[craft][item] * count;
                        }
                    }
                }
            }
        }

        // Creation texte items
        let items_text = "";
        for (let item in items){
            if(item == "newline")
                items_text += "\n";
            else
                items_text += items[item] + Item.get(item).emoji;
        }

        // Creation texte ladder
        let ladder = "";
        for (i = 0; i < 20; i++) {
            ladder += (i===0?'🥇':(i===1?'🥈':(i===2?'🥉':i+1))) + " : " + leaderboard[i].name + " **" + leaderboard[i].or + "**<:Kamas_Or:780851275948228628> " + leaderboard[i].argent + "<:Kamas_Argent:780851275956617236>\n";
        }

        channelFr.send("Félicitations aux **" + this.inventory.inventory.size + "** participants ! Grace à vous, nous avons pu récolter : \n" + items_text,
            {
            embed: {
                "description" : ladder
                }
            });
        channelEn.send("Congrats everyone ! **" + this.inventory.inventory.size + "** participants ! Just a quick review of what we dropped : \n" + items_text,
            {
                embed: {
                    "description" : ladder
                }
            });
    }

};