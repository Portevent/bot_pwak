// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'reply',
    aliases: ['talk', 'start'],
    description: '(commande par défaut) Répond à \' envoyeur du message',
    guildOnly: true,
    execute(message, args) {
        function randomText(){
            let verbe = [
                "Je suis",
                "J'aime",
                "C'est",
                "As tu",
                "J'ai vendu",
                "Il y a",
                "Montre moi",
                "Regade",
                "Et paf ca fait",
                "Il faut acheter",
                "Il faut vendre",
                "J'essaye de trouver",
                "Il est interdit de marcher sur",
                "Il ne faut pas lancer",
                "J'ai vu",
                "Est tu",
                "Je me suis marié avec",
                "Mon père était",
                "Le dernier arrivé est",
                "Celui qui lis ça est",
                "J'ai déjà vu",
                "As tu déjà vu",
                "J'ai déjà tué",
                "J'aspire à devenir",
            ];

            let objet = [
                "un Iop",
                "un Cra",
                "un Feca",
                "un Eniripsa",
                "un Osamodas",
                "un Roublard",
                "un Huppermage",
                "un Ouginak",
                "un Sacrieur",
                "un Steamer",
                "un Sram",
                "un Zobal",
                "un Enutrof",
                "un Eliotrope",
                "un Xelor",
                "un Ecaflip",
                "un Pandawa",
                "un Sadida",
                "un bouftou",
                "un piou",
                "un wabbit",
                "un mansot",
                "un tofu",
                "un blop",
                "une gélée",
                "une truche",
                "un scarafeuille",
                "un bandit",
                "un pnj",
                "un chacha",
                "un chienchien",
                "un prespic",
                "un sanglier",
                "une arakne",
                "un abraknyde",
                "un pichon",
                "un tournesol",
                "une larve",
                "un bwork",
                "un gobelin",
                "un gobelin",
                "un moskito",
                "une dragodinde",
                "une muldo",
                "une volkorne",
                "une kokulte",
                "une kaskargo",
                "une goule",
                "un koalak",
                "un craqueleur",
                "un craqueboule",
                "un bwak",
                "un pwak",
                "une merulette",
            ];

            let adjectif = [
                "rouge",
                "orange",
                "jaune",
                "vert",
                "bleu",
                "violet",
                "rose",
                "noir",
                "blanc",
                "multicolor",
                "rapide",
                "robuste",
                "intelligent",
                "chanceux",
                "agile",
                "sage",
                "immobile",
                "excité",
                "rond",
                "carre",
                "mort",
                "vivant",
                "rigolo",
                "endormis",
            ];

            let adjectifBonus = "";
            if(Math.random() > 0.8){
                adjectifBonus = randomElementOfArray(adjectif);
            }

            return randomElementOfArray(verbe) + ' ' + randomElementOfArray(objet) + ' ' + adjectifBonus
        }

        function randomHumanReplyTime(){
            // Return a random time between 1 and 2 seconds
            return (1 + Math.random()) * 1000;
        }

        function randomElementOfArray(array){
            return array[Math.floor(Math.random() * array.length)];
        }


        setTimeout(() => {
            if (message.client.stop) return;
            message.reply(randomText());
        }, randomHumanReplyTime());
    },
};


