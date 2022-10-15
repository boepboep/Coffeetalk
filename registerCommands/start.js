const {SlashCommandBuilder} = require('@discordjs/builders');
var fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the CoffeeTalk session'),
    async execute(interaction) {
        const channelData = await readSelectedChannelData();
        const timingDataString = await readSelectedDuration();
        const question = await readSelectedQuestion();
        const timingData = parseInt(String(timingDataString));
        const timingDataInMinutes = timingData / 60000;

        if (channelData[0] === null) {
            const delay = (timingData + 2000);
            const minimumAmountOfPeople = 1;
            var memberIds = getMembersInChannel(interaction, channelData[1]);
            var randomMemberIds = [];

            if (memberIds.length >= minimumAmountOfPeople) {
                interaction.reply("Successfully started with " + memberIds.length + " people! The question for this round is " + question + ". The duration of this CoffeeTalk is set to " + timingDataInMinutes + " minutes!");
                createChannels(interaction, memberIds).then(channelIds => {
                    randomMemberIds = shuffleMemberIds(memberIds);
                    moveMembers(interaction, randomMemberIds, channelIds);
                    setTimeout(() => moveMembersBack(interaction, randomMemberIds, channelData[1]), (timingData));
                    setTimeout(() => deleteChannels(interaction), (delay));
                });
            } else {
                interaction.reply("You need at least " + minimumAmountOfPeople + " people to start a CoffeeTalk session")
            }
        } else {
            interaction.reply("The selected channel has not been set or could not be found. Please select a channel by using /selectchannel while in a voice channel");
        }
    }
};

function readSelectedChannelData() {
    return new Promise(resolve => {
        fs.readFile('./configuration/selected-channel.txt', 'utf8', function (err, data) {
            var channelData = []
            channelData.push(err);
            channelData.push(data);
            resolve(channelData);
        });
    })
}

function readSelectedDuration() {
    return new Promise(resolve => {
        fs.readFile('./configuration/selected-duration.txt', 'utf8', function (err, data) {
            var milliseconds = 300000;
            if (err === null) {
                milliseconds = data;
            }
            resolve(milliseconds);
        });
    })
}

function readSelectedQuestion() {
    return new Promise(resolve => {
        fs.readFile('./configuration/selected-question.txt', 'utf8', function (err, data) {
            var question = "No specific question for this round"
            if (err === null) {
                question = data;
            }
            resolve(question);
        })
    })
}

function getMembersInChannel(interaction, data) {
    const channel = interaction.guild.channels.cache.get(data);
    var memberIds = [];
    for (let member of channel.members) {
        memberIds.push(member[0]);
    }
    return memberIds;
}

async function createChannels(interaction, memberIds) {
    var channelIds = []
    var amountOfChannels = Math.ceil(memberIds.length / 2);
    for (let i = 0; i < amountOfChannels; i++) {
        await interaction.guild.channels.create("CoffeeTalk " + (i + 1), {
            type: 'GUILD_VOICE'
        }).then(result => {
            channelIds.push(result.id);
        });
    }
    return channelIds;
}

function shuffleMemberIds(memberIds) {
    for (let i = memberIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = memberIds[i];
        memberIds[i] = memberIds[j];
        memberIds[j] = temp;
    }
    return memberIds;
}

function moveMembers(interaction, randomMembersIds, channelIds) {
    var currentMemberCount = 0;
    for (let i = 0; i < channelIds.length; i++) {
        if (randomMembersIds[currentMemberCount]) {
            interaction.guild.members.fetch(randomMembersIds[currentMemberCount]).then(member => member.voice.setChannel(channelIds[i]));
            currentMemberCount++;
        }
        if (randomMembersIds[currentMemberCount]) {
            interaction.guild.members.fetch(randomMembersIds[currentMemberCount]).then(member => member.voice.setChannel(channelIds[i]));
            currentMemberCount++;
        }
    }
}

function moveMembersBack(interaction, randomMemberIds, selectedChannel) {
    for (let memberId of randomMemberIds) {
        interaction.guild.members.fetch(memberId).then(member => member.voice.setChannel(selectedChannel));
    }
}

function deleteChannels(interaction) {
    interaction.guild.channels.cache.forEach((channel) => {
        if(channel.name.includes("CoffeeTalk")) channel.delete();
    });
}
