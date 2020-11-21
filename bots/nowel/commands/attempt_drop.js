// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'attempt_drop',
    aliases: ['attemptdrop', 'attemptDrop'],
    description: 'Tente un drop',
    adminOnly: true,
    secret: true,
    guildOnly: true,
    execute(message, args) {
        let nb = Math.random();

        const malus = 2 * (5 - message.client.messageSinceLastDrop);

        nb *= Math.max(1, 1 + malus);

        if(nb < 0.2){
            message.client.execute('drop', message, []);
            message.client.messageSinceLastDrop = 0;
        }else{
            message.client.messageSinceLastDrop++;
        }
    },
};