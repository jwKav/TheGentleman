// index.js
const { Client, GatewayIntentBits } = require("discord.js");
const { token, logChannelId } = require("./config/botConfig.json");
const roleManagement = require("./commands/roleManagement");
const logger = require("./utils/logger");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// When the client is ready, run this code (only once).
client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

// Role management
roleManagement(client, logChannelId);
