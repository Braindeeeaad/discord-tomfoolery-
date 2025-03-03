const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags  } = require('discord.js');
const dotenv = require('dotenv'); 
dotenv.config();
const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildWebhooks, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent
] });

client.commands = new Collection();


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);


//Discord doesn't have a webhook event,so I gotta do this MacGyver type shi 

//Listen to webhooks
client.on(Events.MessageCreate, async (message) =>{
	//console.log('Message:', message.content);
	if(!message.webhookId) return;

	
	const thread = message.channel; 
	const attachments = message.attachments;
	//assume webhook string is: create-unit,unitName  
	const commandstr = message.content.split(',');
	const commandName = commandstr[0];
	const unitName = commandstr[1];
	console.log('Webhook Command:',message.content);
	//get command object
	
	const command = client.commands.get(commandName);
	if(!command){
		console.log('Un-recognized commadn');
		return; 
	}
	let reply = undefined; 
	try{
		switch(commandName){
			case 'create-unit':
				const channel = thread.parent;
				await message.delete();
				reply = await command.create_unit(unitName,thread,channel); 
			break; 
			case 'merge': 
				const pdfobj  = attachments.first();
				reply = await command.merge(unitName,pdfobj,thread);
				await message.delete();
				//console.log('Attachments: '+pdfurl); 

			break;
		}
		await thread.send({
			content: reply.content
		}) 
		 
	} catch(error) {
		console.error(error);

	}
	
	//Gotta make mock interaction object depending on command and send 

});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});
