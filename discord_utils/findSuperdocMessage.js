const findSuperdocMessage = async(channel)=>{ 
    const messages = await channel.messages.fetch({limit:100}); 
    const topdown_messages = messages.reverse(); 
    const firstMessage = messages.find(msg => msg.content.includes('SUPERDOC:')); 

    return firstMessage; 
}

module.exports = {findSuperdocMessage};