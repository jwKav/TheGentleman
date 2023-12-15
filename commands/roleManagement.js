// commands/roleManagement.js
const { Collection } = require("discord.js");
const logger = require("../utils/logger");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMembersWithTimeout = async (guild, timeout) => {
  try {
    await guild.members.fetch({ force: true, timeout });
    return true;
  } catch (error) {
    throw new Error(
      `Error fetching members in ${guild.name}: ${error.message}`
    );
  }
};

const removeRoleFromMember = async (guildMember, role, logChannel) => {
  try {
    await guildMember.roles.remove(role);
    logger.log(
      `Removed '${role.name}' from ${guildMember.user.tag} in ${guildMember.guild.name}`,
      logChannel
    );
  } catch (error) {
    logger.error(
      `Error removing '${role.name}' from ${guildMember.user.tag} in ${guildMember.guild.name}: ${error.message}`,
      logChannel
    );
  }
};

module.exports = async (client, logChannelId) => {
  client.on("ready", async () => {
    while (true) {
      client.guilds.cache.forEach(async (guild) => {
        try {
          if (await fetchMembersWithTimeout(guild, 60000)) {
            let highestRole;
            // List of roles to consider in the hierarchy
            const rolesToConsider = ["Geezer", "Gamer", "Member", "Stranger"];

            const membersToRemoveRoles = guild.members.cache.filter(
              (guildMember) => {
                const memberRoles = guildMember.roles.cache;

                highestRole = memberRoles.reduce(
                  (prev, role) => {
                    if (rolesToConsider.includes(role.name)) {
                      return role.position > prev.position ? role : prev;
                    }
                    return prev;
                  },
                  { position: -1 }
                ); // Initialize with a role with position -1

                const hasMultipleRoles =
                  memberRoles.filter((role) =>
                    rolesToConsider.includes(role.name)
                  ).size > 1;

                return (
                  hasMultipleRoles &&
                  memberRoles.some(
                    (role) =>
                      rolesToConsider.includes(role.name) &&
                      role.position < highestRole.position &&
                      role.name !== "Geezer"
                  )
                );
              }
            );

            await Promise.all(
              membersToRemoveRoles.map(async (guildMember) => {
                const logChannel = guild.channels.cache.get(logChannelId);
                const rolesToRemove = guildMember.roles.cache.filter(
                  (role) =>
                    rolesToConsider.includes(role.name) &&
                    role.position < highestRole.position &&
                    role.name !== "Geezer"
                );

                await Promise.all(
                  rolesToRemove.map(async (role) =>
                    removeRoleFromMember(guildMember, role, logChannel)
                  )
                );
              })
            );
          }
        } catch (error) {
          const logChannel = guild.channels.cache.get(logChannelId);
          logger.error(error.message, logChannel);
        }
      });

      await sleep(5000);
    }
  });
};
