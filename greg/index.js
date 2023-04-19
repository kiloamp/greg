const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { exec } = require("child_process");


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on("messageCreate", function (msg) {
	// if message begins with "ping"
	if (msg.content.indexOf("ping") === 0) {
		// send a message to the channel the ping message was sent in.
		msg.channel.send("shiiet mofo stop pinging me i was asleep");
	}
	
	else if (msg.content.indexOf("add") === 0){
		// date prep
		let text = msg.content.split(" ");
		let date = text[1] + text[2];
		let content_raw = text.slice(3);
		let content = content_raw.join(' ');
		//replace(",", " ");
		let meme = "'### " + date + "\n* " + content + "\n \n'";
		exec("cd /home/carlos/calendar && printf " + meme + " >> calendar.md && /home/carlos/calendar/script.sh", (error, stdout, stderr) => {
   		if (error) {
       	 		console.log(`error: ${error.message}`);
        		return;
    		}
    		if (stderr) {
        		console.log(`stderr: ${stderr}`);
       		 	return;
    		}
    		console.log(`stdout: ${stdout}`);
		});
		msg.channel.send("I have addded this to the calendar");
	}
	
	else if(msg.content.indexOf("list") === 0){
		exec("sed -n 4,18p /home/carlos/calendar/calendar_cleaned.md", (error, stdout, stderr) => {
   		if (error) {
       	 		console.log(`error: ${error.message}`);
       			return;
   		}
		if (stderr) {
        		console.log(`stderr: ${stderr}`);
       			return;
    		}
    		msg.channel.send(`Here are the next few events\n${stdout}`);
		});
	}
});

client.login(token);
