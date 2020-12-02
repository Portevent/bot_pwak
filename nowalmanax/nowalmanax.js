const fetch = require('node-fetch');
const fs = require("fs");

class Nowalmanax {

    constructor(client) {
        this.usersDroppedMention = new Map();

        this.day = 1;
        this.questItem = 'nowalmanax_star';

        this.url = require("./nowalmanax_url.json").url;

        this.emojisManager = client.emojis;

        this.loadCalendar();
        this.loadDay();
        this.postToday();
    }

    reset(day = 1){
        this.moveDay(day - this.day);
        this.postToday();
    }
    advance(){
        this.moveDay(1);
        this.postToday();
    }
    revert(){
        this.moveDay(-1);
        this.postToday();
    }

    moveDay(day) {
        this.day += day;
        if(this.day >= this.emojis.length) this.day = 1;
        if(this.day <= 0) this.day = this.emojis.length - 1;
        this.loadDay();
    }

    loadCalendar() {
        this.calendar = require("./nowalmanax.json");
        this.emojis = this.calendar.emojis;
        this.images = this.calendar.images;
    }

    loadDay(){
        this.usersDroppedMention = new Map();
        this.emojiId = this.emojis[this.day];
        this.emoji = this.emojisManager.cache.find(emoji => emoji.id === this.emojiId);
    }

    async postToday() {
        return;

        await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify({
                "content": "Pour trouver la cadeau du jour, il faut capturer un :\nTo find the daily gift, you must catch a : ",
                "username": this.day + " Décembre",
                "avatar_url": this.images[this.day]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify({
                "content": this.emoji.url,
                "username": this.day + " Décembre",
                "avatar_url": this.images[this.day]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
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
        if(this.usersDroppedMention.has(user.id) && reaction.message.author.id === user.id && reaction.emoji.id === this.emojiId){
            reaction.remove();
            this.userValidateQuest(user);
        }
    }

    userValidateQuest(user) {
        const language = user.client.getLanguage(user);
        user.send(
            {
                "fr": 'Je me demande ce qu\'il contient !',
                "en": 'What\'s inside ?'
            }[language],
            {
                embed: {
                    "title": {
                        "fr": "Cadeau du " + this.day + " Decembre",
                        "en": this.day + (this.day===1?"st":(this.day===2?"nd":"th")) + " of December's Gift"
                    }[language],
                    "description": {"fr": "Trouver un ", "en": "Find a "}[language] + "<:" + this.emoji.name + ":" + this.emoji.id + ">",
                    "thumbnail": {
                        "url":  this.images[this.day],
                    }
                },
                //files: ['https://cdn.discordapp.com/attachments/770768439773888532/779761054866735124/89045.png']
            }).then(message => {
            message.react('🎁');
        });
    }

    export(filename = "save"){
        fs.writeFile("./nowalmanax/saves/" + filename + ".json", JSON.stringify(Object.fromEntries(this.usersDroppedMention), null, 4), err => {
            if(err) {
                console.log(err);
            }
        });
    }

    import(filename = "save"){
        try{
            this.usersDroppedMention = new Map(Object.entries(require("./saves/" + filename + ".json")));
            return 0;
        }catch(e){
            return e;
        }
    }
}

module.exports = Nowalmanax