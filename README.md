# Discord Bot with OAuth2 Integration, Auto-Join, and Mass DM Functionality

## Description
This Discord bot enables users to connect via OAuth2, automatically adds them to a specified server upon connection, and sends personalized direct messages (DMs) to the user. The bot also includes slash commands for creating connection buttons and sending mass DMs. It's ideal for promoting services, engaging with new server members, and building a community.

## Features
- **OAuth2 Authentication**: Securely authenticate users via OAuth2.
- **Automatic Server Join**: Automatically adds users to a specific server after authentication.
- **Personalized Direct Messages**: Sends custom welcome messages to users via DM.
- **Slash Commands**:
  - `/c`: Create a message with a connection button.
  - `/msg`: Send a personalized message to all contacts who have interacted with the bot.
- **Compliant with Discord's API**: Designed to adhere to Discord's API and usage policies.

## Prerequisites
- Node.js (version 14 or higher)
- A Discord Developer account with a registered application
- A server where the bot will be added
- OAuth2 redirect URI configured in the Discord Developer Portal

## Setup Instructions

### Clone the Repository:
```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name 
```
## Install Dependencies:
```bash
npm install
```
# Configuration Instructions

## 1. Update the `index.js` File

Open the `main.js` file in your project directory and replace the placeholders with your actual credentials.

### Replace the following placeholders:

- **`TON_BOT_TOKEN`**: Your bot's token.
- **`TON_CLIENT_ID`**: Your Discord application's client ID.
- **`TON_CLIENT_SECRET`**: Your Discord application's client secret.
- **`TON_GUILD_ID`**: The ID of the server where users will be automatically joined.

### Example:

```javascript
const token = 'YOUR_BOT_TOKEN'; // Replace with your bot's token
const clientId = 'YOUR_CLIENT_ID'; // Replace with your application's client ID
const clientSecret = 'YOUR_CLIENT_SECRET'; // Replace with your application's client secret
const guildId = 'YOUR_GUILD_ID'; // Replace with the ID of the server
```

### Instructions

1. **Create a new file named `CONFIGURATION.md`** in your project directory.
2. **Copy and paste the content above** into the `CONFIGURATION.md` file.
3. **Save the file** and commit it to your Git repository.

This `CONFIGURATION.md` file will provide clear instructions to anyone who needs to configure the bot, making it easy to replace the necessary placeholders and set up the OAuth2 redirect URI correctly.
