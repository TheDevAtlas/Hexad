const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Discord bot setup
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

discordClient.once('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('messageCreate', async message => {
  if (message.author.bot) return; // Ignore messages from bots
  console.log(`Received message from ${message.author.tag}: ${message.content}`); // Log received message

  if (message.content === '!controlpanel') {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('Stop')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('status')
          .setLabel('Status')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('help')
          .setLabel('Help')
          .setStyle(ButtonStyle.Secondary)
      );

    try {
      await message.reply({
        content: 'Icarus\'s Control Panel:',
        components: [row]
      });
      console.log("Control panel sent.");
    } catch (error) {
      console.error("Failed to send control panel:", error);
    }
  }
});

discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  console.log(`Button pressed: ${interaction.customId}`); // Log button press

  try {
    switch (interaction.customId) {
      case 'stop':
        await interaction.reply('Stopping tasks...');
        break;
      case 'status':
        await interaction.reply('Status: All systems operational.');
        break;
      case 'help':
        await interaction.reply('Help: Here are the available commands...');
        break;
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
  }
});

// Replace with your Discord bot token
discordClient.login('MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gs6JDq.eEFidJ4tsTvESqd1uLr0ipmGmOYynzShAvfnRs');
