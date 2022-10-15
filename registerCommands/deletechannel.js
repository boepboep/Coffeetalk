const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletechannel')
        .setDescription('Delete all CoffeeTalk channels'),
    async execute(interaction) {
        interaction.guild.channels.cache.forEach((channel) => {
            if(channel.name.includes("CoffeeTalk")) channel.delete();
        });
        interaction.reply({ content: 'CoffeeTalk channels deleted!' })
    }
};
