const findSuperdocMessage = require('./findSuperdocMessage.js');

const writeFirstMessage = async(interaction, channel,unit_info)=>{
    const firstMessage = await findSuperdocMessage(channel);    
    if(firstMessage){
        await interaction.reply(firstMessage.content+',\n'+unit_info.lable+'-->'+unit_info.url)
        return; 
    }

    const res = await interaction.reply(
        {content: "SUPERDOC: \n "+unit_info.lable+'-->'+unit_info.url} 
    );
    await res.pin();
    
}

module.exports = {writeFirstMessage};