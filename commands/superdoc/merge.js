
const { SlashCommandBuilder, MessageFlags , PermissionsBitField} = require('discord.js');
const {downloadPdf} = require('../../pdf_utils/downloadPdf'); 
const {combineWithSuperDoc} = require('../../gemini_utils/combineSuperDoc.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('merge')
		.setDescription("dd your course to get access to your class's chat!")
        .addStringOption(option =>
            option.setName('name')
                .setDescription("add the name of the unit you want to create")
        )
        .addAttachmentOption(option => 
            option.setName('pdf') 
                .setDescription("attach pdf to merge to superdoc!")
        ),    
	async execute(interaction) {

        const unitName = await interaction.options.getString('name'); 
        const pdfobj = await interaction.options.getAttachment('pdf'); 

        const pdf = await downloadPdf(pdfobj.url); 


        console.log('Pdf data: ', pdf);
        await interaction.reply({
            content: "I'm cooking", 
            flags: MessageFlags.Ephemeral,
        });

	},
}

