// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'ladder',
    aliases: ['leaderboard', 'l', 'top', 'classement'],
    description: {
        "fr": "Affiche le classement",
        "en": "Show the leaderboard"
    },
    delete: true,
    cooldown: 5,
    async execute(message, args) {
        const language = message.client.getLanguage(message.channel);
        let leaderboard = [];
        let i = 0;
        let j = 0;
        const inventory = message.client.inventory;

        let messages = await message.channel.messages.fetch({ limit: 5 });
        let usersToHave = new Map();
        for(let message of messages.values()){
            usersToHave.set(message.author.id, true);
        }

        //console.log(inventory.inventory.keys());
        for(let userId of inventory.inventory.keys()){
            j++;
            //console.log(userId + ' : 1 ' + j + '/' + inventory.inventory.size);
            if(inventory.userHasItem(userId, 'ladder')){
                let member = await message.client.referenceGuild.members.fetch(userId).catch(e => message.client.logError(e));
                let user;
                //console.log(userId + ' : 1.5 ' + j + '/' + inventory.inventory.size);
                if(!member) {
                    member = null;
                    user = await message.client.users.fetch(userId).catch(e => message.client.logError(e));
                }else{
                    user = member.user
                }
                let current = {
                    id: user.id,
                    name: (member?member.nickname:user.username),
                    or: inventory.getItemOfUser(user.id, 'kamas_or'),
                    argent: inventory.getItemOfUser(user.id, 'kamas_argent'),
                }
                //console.log(userId + ' : 2 ' + j + '/' + inventory.inventory.size);
                //console.log(current.id + ' : ' + current.name + ' (' + current.or + ' / ' + current.argent + ')');
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
                //console.log(userId + ' : 3 ' + j + '/' + inventory.inventory.size);
            }
        }

        let ladder = "";
        let pre = -1;

        //console.log("Leaderboard : " + leaderboard);

        for (i = 0; i < leaderboard.length; i++) {
            //console.log(i);
            if(i < 9 || usersToHave.has(leaderboard[i].id)){
                if(pre + 1 !== i){ //If we skipped some places
                    ladder += '...\n';
                }
                pre = i;
                ladder += (i===0?'🥇':(i===1?'🥈':(i===2?'🥉':i+1))) + " : " + leaderboard[i].name + " **" + leaderboard[i].or + "**<:Kamas_Or:780851275948228628> " + leaderboard[i].argent + "<:Kamas_Argent:780851275956617236>\n";
            }
        }
        if(ladder === ""){
            ladder = {fr:"Le concours des Gourmands de Nowel ne recrute que des chefs de renom",en:"The Nowel Gourmet Competition only recruits renowned chefs"}[language]
        }

        //console.log("Ladder : " + ladder);
        if(message.channel.type === "dm"){
            message.author.send(ladder).catch(e => message.client.logErrorMsg(e, message));
        }
        else{
            message.client.sendWebhook(message.client.offTopics[language], {
                "content": "",
                "username": {fr:"Classement",en:"Ladder"}[language],
                "avatar_url": "https://cdn.discordapp.com/attachments/781503539142459452/785398844132294706/16074.png",
                "embeds": [
                    {
                        "description": ladder,
                        "footer": {
                            "text": {fr:"Une toque de chef gourmand est requise pour aspirer à devenir le plus grand Gourmand de Nowel",en:"A gourmet chef’s hat is required to aspire to become Nowel’s greatest gourmet"}[language],
                            "icon_url": "https://cdn.discordapp.com/attachments/781503539142459452/785398844132294706/16074.png"
                        }
                    }
                ]
            });
        }
    }
};