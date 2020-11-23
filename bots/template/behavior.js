// noinspection JSUnusedLocalSymbols,JSUnresolvedVariable
module.exports = {
    //prefix:'!', /!\ Override any bot prefix

    prefixOptionalInDm: true, // Allow user to skip the prefix when private messaging a bot

    onceReady(client) {
    },
    onMessage(message) {
        // Called when receiving a message
        // Basic behavior use this to redirect the message to a sub function :
        // - onUserMessage(message) : when the message is from an user
        // - onOwnMessage(message) : when the message is from the bot itself
        // - onBotMessage(message) : when the message is from another bot
        // - onWebhook(message) : when the message is from a webhook
        // - onCommand(message, args, commandName) : when receiving a command
        // - onNullCommand(message) : when just the prefix is typed (but no command name)
        // - onInvalidCommand(message, args, commandName) : when the command doesn't exist
        // - onCommandError(message, args, error, command) : error while processing onCommand()
        // - onCommandInvalidGuildOnly(message, args, command) : when a guild only command is sent in DM
        // - onCommandInvalidDmOnly(message, args, command) : when a DM only command is sent in guild
        // - onCommandInvalidArgsCount(message, args, command) : when there is not enough arguments for the function
        // - onCommandInvalidCooldown(message, args, command, timeLeft) : when the user tries to spam the command
    },

    onUserMessage(message){
        // See onMessage()
    },
    onOwnMessage(message){
        // See onMessage()
    },
    onBotMessage(message){
        // See onMessage()
    },
    onWebhook(message){
        // See onMessage()
    },
    onCommand(message, args, commandName){
        // See onMessage()
    },
    onNullCommand(message){
        // See onMessage()
    },
    onInvalidCommand(message, args, commandName){
        // See onMessage()
    },
    onCommandError(message, args, error, command){
        // See onMessage()
    },
    onCommandInvalidGuildOnly(message, args, command){
        // See onMessage()
    },
    onCommandInvalidDmOnly(message, args, command){
        // See onMessage()
    },
    onCommandInvalidArgsCount(message, args, command){
        // See onMessage()
    },
    onCommandInvalidCooldown(message, args, command, timeLeft){
        // See onMessage()
    },

    onReaction(reaction, users){
        // When a reaction is added
    }
}