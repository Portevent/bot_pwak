// noinspection JSUnusedLocalSymbols
module.exports = {
    name: 'hello_world',
    aliases: ['Hello World !'],
    description: 'Hello World !',
    execute(message, args) {
        message.reply('Hi !');
    },
};