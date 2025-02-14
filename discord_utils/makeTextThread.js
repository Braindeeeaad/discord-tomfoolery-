
const makeTextThread = async(interaction, channel, courseSection)=>{
    
    //If there is a channel
    if(!channel){
        console.log("makeTextThread: undefined channel");
        return; 
    }

    //If the thread already exists, return it 
    const activeThreads = channel.threads.fetchActive();
    const assumingThread = activeThreads.find(thread => thread.name == courseSection); 
    if(assumingThread) 
        return assumingThread; 

    //else make thread  
    const thread = await textChannel.threads.create({
        name: courseSection,
        autoArchiveDuration: 60, // Auto-archive after 60 minutes of inactivity
        type: 11, // 11 = Public thread
        reason: 'Discussion for the course',
    });
    await interaction.reply(`Thread created: ${thread.name}`);
    return thread;     
}

module.exports(makeTextThread); 