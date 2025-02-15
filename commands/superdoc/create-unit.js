const { SlashCommandBuilder, MessageFlags , PermissionsBitField} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
		.setName('create-unit')
		.setDescription("dd your course to get access to your class's chat!")
        .addStringOption(option =>
            option.setName('name')
                .setDescription("add the name of the unit you want to create")
        ),    
	async execute(interaction) {

        const unitName = await interaction.options.getString('name');
        await interaction.reply({
            content: "I'm cooking", 
            flags: MessageFlags.Ephemeral,
        });

	},
}

