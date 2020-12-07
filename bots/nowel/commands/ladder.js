// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'ladder',
    aliases: ['leaderboard', 'l', 'top', 'classement'],
    description: {
        "fr": "Affiche le classement",
        "en": "Show the leaderboard"
    },
    admin: true,
    async execute(message, args) {
        let leaderboard = [];
        let i;
        const inventory = message.client.inventory;

        let messages = await message.channel.messages.fetch({ limit: 5 });
        let usersToHave = new Map();
        for(let message of messages.values()){
            usersToHave.set(message.author.id, true);
        }

        for(let userId of inventory.inventory.keys()){
            if(true || inventory.userHasItem(userId, 'ladder')){
                let user = await message.client.referenceGuild.members.fetch(userId);
                let current = {
                    id: user.user.id,
                    name: user.nickname || user.user.username,
                    or: inventory.getItemOfUser(user.user.id, 'kamas_argent'),
                    argent: inventory.getItemOfUser(user.user.id, 'kamas_bronze'),
                }
                //console.log(current.id + ' : ' + current.name + ' (' + current.or + ' / ' + current.argent + ')');
                if(leaderboard.length === 0){
                    leaderboard = [current];
                }else{
                    for(i = 0; i < leaderboard.length; i++){
                        //console.log(' (' + leaderboard[i].or + ' / ' + leaderboard[i].argent + ') VS (' + current.or + ' / ' + current.argent + ')')
                        if(leaderboard[i].or < current.or || (leaderboard[i].or === current.or && leaderboard[i].argent < current.argent)){
                            break;
                        }
                    }
                    leaderboard.splice(i, 0, current);
                }
            }
        }

        let ladder = "<:flocon:780851275930533921> **LADDER** <:Flon_Magique:780851276043780096>\n\n";
        let pre = -1;
        for (i = 0; i < leaderboard.length; i++) {
            if(i < 9 || usersToHave.has(leaderboard[i].id)){
                if(pre + 1 !== i){ //If we skipped some places
                    ladder += '...\n';
                }
                pre = i;
                ladder += (i==0?'🥇':(i==1?'🥈':(i==2?'🥉':i+1))) + " : " + leaderboard[i].name + " **" + leaderboard[i].or + "**<:Kamas_Or:780851275948228628> " + leaderboard[i].argent + "<:Kamas_Argent:780851275956617236>\n";
            }
        }

        console.log("Leaderboard : " + leaderboard);
        console.log("Ladder : " + ladder);

        message.author.send(ladder).catch(e => message.client.logErrorMsg(e, message));
    }
};