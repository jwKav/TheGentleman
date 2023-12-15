// utils/logger.js
module.exports = {
  log: (message, logChannel) => {
    if (logChannel) {
      logChannel.send(message);
    }
  },
  error: (errorMessage, logChannel) => {
    if (logChannel) {
      logChannel.send(`Error: ${errorMessage}`);
    }
    console.error(`Log channel not defined: ${errorMessage}`);
  },
};
