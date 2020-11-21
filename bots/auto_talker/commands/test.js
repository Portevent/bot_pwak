module.exports = {
    name: 'test',
    description: 'test',
    execute(message, args) {
        const emote = message.client.emojis.cache.find(emoji => emoji.name === args[0]);
        message.channel.send(`${emote}`);
        message.channel.send("To string : " + emote.toString());
        message.channel.send("Url : " +emote.url);
        message.channel.send('<:' + emote.name + ':' + emote.id + '>');
        message.channel.send('<:' + emote.identifier + '>');
        message.channel.send("Available : " + emote.available);
    },
};