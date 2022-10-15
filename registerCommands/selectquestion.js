const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selectquestion')
        .setDescription('Select a question for people to answer')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('question someone should answer')
                .setRequired(true)),
    async execute(interaction) {
        var question = interaction.options.get("question").value;
        fs.writeFile('./configuration/selected-question.txt', question, function (err) {
            if (err) {
                return console.log("Error = " + err);
            }
        });
        interaction.reply("Question has been saved")
    }
}
