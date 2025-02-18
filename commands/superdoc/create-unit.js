const { SlashCommandBuilder, MessageFlags , PermissionsBitField} = require('discord.js');
const {createGoogleDoc} =require('../../googledocs_utils/createGoogleDoc.js');
const {db_fetch_course,db_add_course} = require('../../aws_utils/aws-config.js');
const {writeSuperDocMessage} = require('../../discord_utils/writeSuperdocMessage.js');
module.exports = {
    data: new SlashCommandBuilder()
		.setName('create-unit')
		.setDescription("dd your course to get access to your class's chat!")
        .addStringOption(option =>
            option.setName('name')
                .setDescription("add the name of the unit you want to create")
        ),    
	async execute(interaction) {

        //recieve interaction info 
        const unitName = await interaction.options.getString('name'); 
        const thread = interaction.channel; 
        const channel = thread.parent; 
        
        
        //force return if thread isn't a superdoc thread
        if(!thread.name.includes('superdoc-')){
            await interaction.reply({
                content: "please call this command in a superdoc thread!", 
                flags: MessageFlags.Ephemeral,
            });    
            return;
        }

        //gets course-id using interaction info  
        const courseSection = thread.name.replace("superdoc-",""); 
        const courseId = channel.name+'-'+courseSection
        console.log("Fetching course:",courseId);
        
        //fetched course data from dyanmodb 
        let course_info = await db_fetch_course(courseId); 


        //checks if unit with same name already exist 
        if(course_info.units.some(item=>item.lable === unitName)){
            await interaction.reply({
                content: "Another unit already has this name", 
                flags: MessageFlags.Ephemeral,
            });    
            return;
        }
        //makes google doc of unit 
        const doc = await createGoogleDoc(unitName); 
       // console.log("Doc json:",doc);
        //alters course_info to append doc information into units list 
        course_info.units.push({label:unitName,url:doc.documentId});
        //
        await writeSuperDocMessage(thread,{lable:unitName,url:`https://docs.google.com/document/d/${doc.documentId}/edit`});
        //pushes course info back to db 
        await db_add_course(courseId,course_info);

      //  console.log("interaction info: ",interaction.channel);

        await interaction.reply({
            content: "Uploaded doc!", 
            flags: MessageFlags.Ephemeral,
        });

	},
}

