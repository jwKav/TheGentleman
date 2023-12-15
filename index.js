const { Client, GatewayIntentBits } = require("discord.js");
const { token, logChannelId } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// List of roles to consider in the hierarchy
const rolesToConsider = ["Geezer", "Gamer", "Member", "Stranger"];

// When the client is ready, run this code (only once).
client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

client.on("ready", () => {
  setInterval(async () => {
    const currentDate = new Date();
    const formattedTime = `${String(currentDate.getHours()).padStart(
      2,
      "0"
    )}:${String(currentDate.getMinutes()).padStart(2, "0")}:${String(
      currentDate.getSeconds()
    ).padStart(2, "0")}`;
    client.guilds.cache.forEach(async (guild) => {
      try {
        // Fetch all members in the guild with an extended timeout
        await guild.members.fetch({ force: true, timeout: 60000 }); // 60 seconds timeout

        // Now you can iterate over all members, including offline ones
        guild.members.cache.forEach(async (guildMember) => {
          const memberRoles = guildMember.roles.cache;

          // Get the highest role among the specified roles
          const highestRole = memberRoles.reduce((prev, role) => {
            if (rolesToConsider.includes(role.name)) {
              return role.position > prev.position ? role : prev;
            }
            return prev;
          });

          // Check if the user has more than one of the specified roles
          const hasMultipleRoles =
            memberRoles.filter((role) => rolesToConsider.includes(role.name))
              .size > 1;

          // If the user has more than one of the specified roles, remove roles below the highest role
          if (hasMultipleRoles) {
            memberRoles.forEach(async (role) => {
              if (
                rolesToConsider.includes(role.name) &&
                role.position < highestRole.position &&
                role.name !== "Geezer"
              ) {
                try {
                  // Remove the role from the member
                  await guildMember.roles.remove(role);
                  // Log the message to a specific channel
                  const logChannel = guild.channels.cache.get(logChannelId);
                  if (logChannel) {
                    logChannel.send(
                      `Removed '${role.name}' from ${guildMember.user.tag} in ${guild.name}`
                    );
                  } else {
                    console.error(
                      `Log channel with ID ${logChannelId} not found in ${guild.name}`
                    );
                  }
                } catch (error) {
                  console.error(
                    `Error removing '${role.name}' from ${guildMember.user.tag} in ${guild.name}: ${error.message}`
                  );
                  // Log the error message to the same log channel
                  const logChannel = guild.channels.cache.get(logChannelId);
                  if (logChannel) {
                    logChannel.send(
                      `Error removing '${role.name}' from ${guildMember.user.tag} in ${guild.name}: ${error.message}`
                    );
                  } else {
                    console.error(
                      `Log channel with ID ${logChannelId} not found in ${guild.name}`
                    );
                  }
                }
              }
            });
          }
        });
      } catch (error) {
        console.error(
          `Error fetching members in ${guild.name}: ${error.message}`
        );
        // Log the error message to the same log channel
        const logChannel = guild.channels.cache.get(logChannelId);
        if (logChannel) {
          logChannel.send(
            `Error fetching members in ${guild.name}: ${error.message}`
          );
        } else {
          console.error(
            `Log channel with ID ${logChannelId} not found in ${guild.name}`
          );
        }
      }
    });
  }, 5000);
});
