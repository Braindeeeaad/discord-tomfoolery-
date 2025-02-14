const { SlashCommandBuilder } = require('discord.js');
const makeTextChannel = require('../../discord_utils/makeTextChannel'); 
const makeTextThread = require('../../discord_utils/makeTextThread');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('Add Course')
		.setDescription("dd your course to get access to your class's chat!")
        .addStringOption(option =>
            option.setName('Course Code'))   
        .addStringOption(option =>
            option.setName('Course Number')) 
        .addStringOption(option =>
            option.setName('Course Section')),    
	async execute(interaction) {

        const courseCode = interaction.options.getString('coursecode');
        const courseNumber = interaction.options.getString('coursenumber');
        const courseSection = interaction.options.getString('coursesection');

        const channel = makeTextChannel(interaction,courseCode,courseNumber);
        
		await interaction.reply('Pong!');

	},
}

