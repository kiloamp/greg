import { parseCommand } from "./greta";

import { Client, Intents } from 'discord.js';
import { token } from './config.json';
import { exec } from "child_process";

import { readFileSync, writeFileSync } from 'fs';
import { refresh } from "./translator";


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

	else if (msg.content.indexOf("add") === 0) {
		const parsed = parseCommand(msg.content);
		msg.channel.send(JSON.stringify(parsed));
		let eventList;

		try {
			eventList = JSON.parse(readFileSync('eventList.json', 'utf8'));
		} catch (error) {
			console.error(error);
			console.log("EventList JSON file was created")
			eventList = [];
			// Expected output: ReferenceError: nonExistentFunction is not defined
			// (Note: the exact output may be browser-dependent)
		}
		eventList.push(parsed);
		writeFileSync('eventList.json', JSON.stringify(eventList, null, 2));
		const htmlString = refresh(eventList);
		writeFileSync('/home/carlos/calendarnew/index.html', htmlString);
	}

	else if (msg.content.indexOf("note") === 0) {
		const parsed = parseCommand(msg.content);
		msg.channel.send(JSON.stringify(parsed));
		let eventList;

		try {
			eventList = JSON.parse(readFileSync('eventList.json', 'utf8'));
		} catch (error) {
			console.error(error);
			console.log("EventList JSON file was created")
			eventList = [];
			// Expected output: ReferenceError: nonExistentFunction is not defined
			// (Note: the exact output may be browser-dependent)
		}
		eventList.push(parsed);
		writeFileSync('eventList.json', JSON.stringify(eventList, null, 2));
		const htmlString = refresh(eventList);
		writeFileSync('/home/carlos/calendarnew/index.html', htmlString);
	}
});

client.login(token);
