const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selecttiming')
        .setDescription('Select the duration in minutes (1-10)')
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('time in minutes')
                .setRequired(true)),
    async execute(interaction) {
        const duration = interaction.options.get("duration").value;
        var milliseconds;

        if (duration >= 1 && duration <= 10) {
            interaction.reply("Duration is now set to " + duration + " minutes.");
            milliseconds = duration * 60000;
            fs.writeFile('./configuration/selected-duration.txt', milliseconds.toString(), function (err) {
                if(err) {
                    return console.log("Error = " + err);
                }
            });
        } else {
            interaction.reply("Please enter a whole number (1-10).");
        }
    }
};
