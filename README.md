# Very Basic Discord.js Bot

A straightforward Discord bot built using `discord.js` that provides role management and authentication functionality. The bot includes features like automated role granting, authentication via reaction posts, and periodic role updates based on member service duration.

---

## Features

- **Authentication Reaction Post**  
  Posts a message on server entry with a reaction for authentication. Members reacting to the post are granted specific roles.  

- **Role Management**  
  Grants roles automatically upon member authentication and removes redundant roles as needed.  

- **Daily Member Update**  
  Connects to a PostgreSQL database to check the length of service of each member.  
  - Promotes members meeting criteria.  
  - Removes outdated roles for inactive members.  

---

## Requirements

- [Node.js](https://nodejs.org/) (v16 or higher, as required by `discord.js`)  
- [Discord.js](https://discord.js.org/)  
- PostgreSQL database  
- A Discord bot token ([Get yours here](https://discord.com/developers/applications))  
