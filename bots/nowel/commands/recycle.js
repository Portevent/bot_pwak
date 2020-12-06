// noinspection JSUnusedLocalSymbols
const Item = require('../../../inventory/item.js');

module.exports = {
    name: 'recycle',
    description: {
        "fr": "Fait fondre les kamas chocolatés pour en faire d'autre",
        "en": "Melts chocolate kamas to make better ones"
    },
    delete: true,
    require: 'can_recycle',
    execute(message, args) {
        const language = message.client.getLanguage(message.channel);
        if(message.client.inventory.userHasItem(message.author.id, 'recycleur1') || message.client.inventory.userHasItem(message.author.id, 'recycleur2')){
            let icon = "https://cdn.discordapp.com/attachments/781503539142459452/785093914285047829/Petit_Recycleur_de_Chokolat.png"
            let nb_bronze = message.client.inventory.getItemOfUser(message.author.id, 'kamas_bronze');
            let nb_argent = message.client.inventory.getItemOfUser(message.author.id, 'kamas_argent');
            let nb_or     = message.client.inventory.getItemOfUser(message.author.id, 'kamas_or');

            // r_XXXX : reste
            let r_bronze = nb_bronze;
            let r_argent = nb_argent;
            let r_or = nb_or;

            // d_XXXX : detla
            r_bronze = r_bronze%10;
            const d_bronze = nb_bronze - r_bronze;
            r_argent += d_bronze/10;
            message.client.inventory.addItemToUser(message.author.id, 'kamas_bronze', -d_bronze);
            message.client.inventory.addItemToUser(message.author.id, 'kamas_argent', d_bronze/10);


            if(message.client.inventory.userHasItem(message.author.id, 'recycleur2')){
                icon = "https://cdn.discordapp.com/attachments/781503539142459452/785093880725897216/Recycleur_de_Chokolat.png";
                const d_argent = r_argent - r_argent%10;
                r_argent = r_argent%10;
                r_or += d_argent/10;
                message.client.inventory.addItemToUser(message.author.id, 'kamas_argent', -d_argent);
                message.client.inventory.addItemToUser(message.author.id, 'kamas_or', d_argent/10);
            }

            message.author.send('',{
                embed: {
                    "description": (r_bronze>0?"<:Kamas_Bronze:780851275955830814> **" + r_bronze + "**\n":"")
                                 + (r_argent>0?"<:Kamas_Argent:780851275956617236> **" + r_argent + "**" + ((r_argent-nb_argent)>0?" (+" + (r_argent-nb_argent) + ")":"") + "\n":"")
                                 + (r_or    >0?"<:Kamas_Or:780851275948228628> **" + r_or + "**" + ((r_or-nb_or)>0?" (+" + (r_or-nb_or) + ")":""):""),
                    "color": 14845952,
                    "author": {
                        "name": {
                            "fr":"Recyclage",
                            "en":"Recycle"
                        }[language],
                        "icon_url": icon
                    }
                }
            });
        }

        else{
            return message.author.send({
                "fr":'Il nous faut un objet capable de faire fondre le chocolat',
                "en":'We need something to melt the chocolate'
            }[language]);
        }

    },
};