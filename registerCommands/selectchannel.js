const {SlashCommandBuilder} = require('@discordjs/builders');
var fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selectchannel')
        .setDescription('Select a channel'),
    async execute(interaction) {
        if(interaction.member.voice.channelId) {
            interaction.reply(interaction.member.voice.channel.name + " is the current selected channel!")
            fs.writeFile('./configuration/selected-channel.txt', interaction.member.voice.channelId, function (err) {
                if (err) {
                    return console.log("Error = " + err);
                }
            });
        } else {
            interaction.reply("Please join a voice channel!");
        }
    }
};
