const fetch = require('node-fetch');

class Nowalmanax {

    constructor() {
        this.users = new Map();
        this.day = 1;
        this.dayQuest = {};
        this.loadCalendar();
        this.loadDay(this.day);
        this.questItem = 'nowalmanax_star';
        this.questItemGoal = 10;
    }

    reset(day = 1){
        this.setDay(day);
        this.loadDay();
        this.postToday();
    }
    advance(){
        this.nextDay();
        this.loadDay();
        this.postToday();
    }
    revert(){
        this.prevDay();
        this.loadDay();
        this.postToday();
    }

    nextDay() {
        this.day += 1;
        if(this.day > 15) this.day = 1;
    }

    setDay(new_day) {
        this.day = new_day;
    }

    prevDay() {
        this.day -= 1;
        if(this.day === 0) this.day = 3;
    }

    async postToday() {
        await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify({
                "content": "Pour obtenir Le Cadeau du Jour il faut : \n\n" + this.instructions,
                "username": this.day + " Décembre",
                "avatar_url": this.calendar.images[this.day]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    loadCalendar() {
        this.calendar = require("./nowalmanax.json");
        this.url = require("./nowalmanax_url.json").url;
    }

    loadDay(){
        this.dayQuest = this.calendar[this.day.toString()];
        this.users = new Map();
        this.usersDroppedMention = new Map();
        this.instructions = "";


        for(let condition of this.calendar._conditions){
            if(this.dayQuest[condition]){
                this.instructions += '- **' + this.calendar._instructions[condition].replace('#value#', this.dayQuest[condition]) + '**\n';
            }
        }
    }

    messageValidateQuest(message){
        if(this.users.has(message.author.id)) return;

        //Use custom messageValidateQuest instead of the default one
        if(this.dayQuest.messageValidateQuest){
            return this.dayQuest.messageValidateQuest(message);
        }

        else{
            let completed = true;
            for(let condition of Object.keys(this.dayQuest)){
                switch(condition){
                    case "msg":
                        completed = completed && true;
                        break;
                    case "msg_equals":
                        completed = completed && message.content.toLowerCase() === this.dayQuest[condition].toLowerCase();
                        break;
                    case "msg_starts_with":
                        completed = completed && message.content.toLowerCase().startsWith(this.dayQuest[condition].toLowerCase());
                        break;
                    case "msg_ends_with":
                        completed = completed &&  message.content.toLowerCase().endsWith(this.dayQuest[condition].toLowerCase());
                        break;
                    case "msg_contains":
                        completed = completed &&  message.content.toLowerCase().includes(this.dayQuest[condition].toLowerCase());
                        break;
                    case "msg_contains_emoji":
                        completed = completed &&  message.content.toLowerCase().includes(this.dayQuest[condition].toLowerCase());
                        break;
                    case "msg_mentions_someone":
                        completed = completed && message.mentions.members.size > 0;
                        break;
                    case "msg_mentions_user":
                        completed = completed && message.mentions.has(this.dayQuest[condition]);
                        break;
                    case "find_daily_mention":
                        completed = false;
                        if(this.usersDroppedMention.has(message.author.id)) return;
                        if(Math.random() > 0.4){
                            this.usersDroppedMention.set(message.author.id, true);
                            message.react(message.client.emojis.cache.find(emoji => emoji.id === this.dayQuest[condition]));
                        }
                        break;
                    default:
                        completed = false;
                        break;
                }
            }

            if(completed){
                this.userValidateQuest(message.channel, message.author);
            }
        }
    }

    reactionValidateQuest(reaction, user){
        if(this.users.has(user.id)) return;

        //Use custom complete quest reaction instead of the default one
        if(this.dayQuest.reactionValidateQuest){
            return this.dayQuest.reactionValidateQuest(reaction, user);
        }

        else {
            let completed = true;
            for (let condition of Object.keys(this.dayQuest)) {
                switch (condition) {
                    case "react_emoji":
                        completed = completed && reaction.emoji.name === this.dayQuest[condition];
                        break;
                    case "react_count":
                        completed = completed && (reaction.count >= this.dayQuest[condition]);
                        break;
                    case "find_daily_mention":
                        completed = this.usersDroppedMention.has(user.id) && reaction.emoji.id === this.dayQuest[condition]
                        if(completed){
                            reaction.remove();
                        }
                        break;
                    default:
                        completed = false;
                        break;
                }
            }

            if (completed) {
                this.userValidateQuest(reaction.message.channel, user);
            }
        }
    }

    userValidateQuest(channel, user) {
        const language = channel.client.getLanguage(user);
        user.send(
            {
                "fr": 'Je me demande ce qu\'il contient !',
                "en": 'What\'s inside ?'
            }[language],
            {
                embed: {
                    "title": {
                        "fr": "Cadeau du " + this.day + " Decembre",
                        "en": this.day + "st/nd/th of December's Gift"
                    }[language],
                    "description": this.instructions,
                    "thumbnail": {
                        "url":  this.calendar.images[this.day],
                    }
            },
            //files: ['https://cdn.discordapp.com/attachments/770768439773888532/779761054866735124/89045.png']
        }).then(message => {
            message.react('🎁');
        });
        this.users.set(user.id, true);
    }
}

module.exports = Nowalmanax