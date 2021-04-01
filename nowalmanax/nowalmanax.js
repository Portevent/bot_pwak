const fetch = require('node-fetch');
const fs = require("fs");

class Nowalmanax {

    constructor(client) {
        this.client = client;
        this.day = 1;
        this.usersDroppedMention = new Map();
        this.usersDroppedMention.set('day', this.day);
        this.questItem = 'nowalmanax_star';

        this.emoji = client.emojis.cache.find(emoji => emoji.id === '827077379851288576');
        this.image = 'https://cdn.discordapp.com/attachments/787442887800782891/827077341183344660/Wabbit.png';
    }

    reset(day = 1){
        this.moveDay(day - this.day);
    }
    advance(){
        this.moveDay(1);
    }
    revert(){
        this.moveDay(-1);
    }

    moveDay(day) {
        this.day += day;
        this.loadDay();
    }

    loadDay(){
        this.usersDroppedMention = new Map();
        this.usersDroppedMention.set('day', this.day);
    }


    attemptNowalmanaxDrop(message){
        if(this.usersDroppedMention.has(message.author.id)) return;
        // noinspection JSIgnoredPromiseFromCall
        if(Math.random() > 0.4){
            this.usersDroppedMention.set(message.author.id, true);
            message.react(this.emoji);
        }
    }

    reactionValidateQuest(reaction, user){
        if(this.usersDroppedMention.has(user.id) && reaction.message.author.id === user.id && reaction.emoji.id === this.emoji.id){
            reaction.remove();
            this.userValidateQuest(user);
        }
    }

    userValidateQuest(user) {
        const language = user.client.getLanguage(user);
        user.send(
            {
                "fr": 'Wow ! Je me demande ce qu\'il contient !',
                "en": 'Wow ! What\'s inside ?'
            }[language],
            {
                embed: {
                    "title": {
                        "fr": "Cadeau du " + this.day + " Avril",
                        "en": this.day + (this.day===1?"st":(this.day===2?"nd":"th")) + " of April's Gift"
                    }[language],
                    "thumbnail": {
                        "url":  this.image,
                    }
                },
            }).then(message => {
            message.react('🍫');
        });
    }

    export(filename = "save"){
        fs.writeFile("./nowalmanax/saves/" + filename + ".json", JSON.stringify(Object.fromEntries(this.usersDroppedMention), null, 4), err => {
            if(err) {
                this.client.logError(err);
            }
        });
    }

    import(filename = "save"){
        try{
            this.usersDroppedMention = new Map(Object.entries(require("./saves/" + filename + ".json")));
            this.day = this.usersDroppedMention.get("day");
            return 0;
        }catch(e){
            return e;
        }
    }
}

module.exports = Nowalmanax