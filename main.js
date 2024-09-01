const { Client, GatewayIntentBits, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const express = require('express');
const axios = require('axios');

const app = express();

const token = 'TON_BOT_TOKEN';
const clientId = 'TON_CLIENT_ID';
const clientSecret = 'TON_CLIENT_SECRET';
const guildId = 'TON_GUILD_ID';
const redirectUri = 'http://localhost:3000/oauth2/callback';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages
    ] 
});

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'c') {
            const messageText = interaction.options.getString('message') || 'Cliquez sur le bouton ci-dessous pour vous connecter.';

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('connect_button')
                        .setLabel('Se connecter')
                        .setStyle(ButtonStyle.Primary),
                );

            await interaction.reply({ content: messageText, components: [row] });
        } else if (interaction.commandName === 'msg') {
            const userMessage = interaction.options.getString('message');
            let dmChannel = await interaction.user.createDM();
            const contacts = await dmChannel.messages.fetch();
            for (let contact of contacts.values()) {
                try {
                    await contact.author.send(userMessage);
                } catch (err) {
                    console.log(`Impossible d'envoyer un message à ${contact.author.tag}`);
                }
            }
            await interaction.reply({ content: 'Message envoyé à tous vos contacts.', ephemeral: true });
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'connect_button') {
            const oauth2Url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20guilds.join`;

            await interaction.reply({
                content: `Veuillez vous connecter en utilisant [ce lien](${oauth2Url}) pour continuer.`,
                ephemeral: true
            });
        }
    }
});

const commands = [
    new SlashCommandBuilder()
        .setName('c')
        .setDescription('Crée un message avec un bouton de connexion')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le message à afficher')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName('msg')
        .setDescription('Envoie un message à tous vos contacts')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le message à envoyer')
                .setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Début du rafraîchissement des commandes (/) pour l\'application.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands.map(command => command.toJSON()) }
        );

        console.log('Les commandes (/) ont été rechargées avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
    }
})();

client.login(token);

app.get('/oauth2/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const user = userResponse.data;

        await axios.put(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {
            access_token: accessToken
        }, {
            headers: {
                Authorization: `Bot ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const dmChannel = await client.users.createDM(user.id);
        await dmChannel.send(
            '**Chez Sly, découvrez un panel de services SMM de qualité supérieure**\n\n' +
            '**2$ = 1k Followers**\n\n' +
            '**0,01$ = 1k Vues**\n\n' +
            '**0,7$ = 1k Likes**\n\n' +
            '**1$ = 1k comments**\n\n' +
            '**Nous couvrons l\'ensemble des réseaux ! N\'hésitez pas à venir nous voir et à poser toutes vos questions. Nous vous garantissons un service rapide, abordable et de qualité inégalée sur le marché.**\n\n' +
            '🔗・https://discord.gg/XyaZy4jeH3'
        );

        res.send(`<h1>Bonjour, ${user.username}!</h1><p>Vous avez été vérifié. Vous pouvez maintenant quitter cette fenêtre.</p>`);

    } catch (error) {
        console.error('Erreur lors de l\'authentification OAuth2:', error.response ? error.response.data : error.message);
        res.status(500).send('Erreur lors de l\'authentification OAuth2.');
    }
});

app.listen(3000, () => {
    console.log('Le serveur OAuth2 fonctionne sur le port 3000');
});
