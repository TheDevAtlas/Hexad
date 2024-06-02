const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const collectBlock = require('mineflayer-collectblock').plugin;

numBot = 0;

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Spawning multiple bots
const bots = [];

class CollectorBot {
  constructor(id) {
    this.bot = mineflayer.createBot({
      host: 'localhost',
      port: 25565,
      username: `collector${id}`,
    });
    this.id = id;
    this.goal = 'Idle'; // Default goal
    this.bot.loadPlugin(pathfinder);
    this.bot.loadPlugin(collectBlock);
  }

  setGoal(goal) {
    this.goal = goal;
  }

  getGoal() {
    return this.goal;
  }

  handleCollectCommand(blockTypeName) {
    // similar implementation as before, also updates this.goal
  }

  stop() {
    this.bot.quit('Stopped by Discord command');
    this.setGoal('Stopped');
  }
}

discordClient.once('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('messageCreate', async message => {
  //if (message.author.bot || !['514427159637655552', 'YourDiscordUserID2'].includes(message.author.id)) return;

  if (message.content === '!controlpanel') {
    // control panel setup as before
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
            .setCustomId('create-bot')
            .setLabel('Create Bot')
            .setStyle(ButtonStyle.Secondary),
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

  switch (interaction.customId) {
    case 'stop':
      bots.forEach(bot => bot.stop());
      await interaction.reply('All bots have been stopped.');
      break;
    case 'status':
      let statusMessage = 'Bot Status:\n';
      bots.forEach((bot, index) => {
        statusMessage += `Bot ${index + 1}: ${bot.getGoal()}\n`;
      });
      await interaction.reply(statusMessage);
      break;
    case 'create-bot':
      const newBot = new CollectorBot(bots.length + 1);
      bots.push(newBot);
      await interaction.reply(`Minecraft bot ${newBot.id} created and connected.`);
      break;
    default:
      await interaction.reply('Unknown command');
  }
});

// Replace with your Discord bot token
discordClient.login('MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gs6JDq.eEFidJ4tsTvESqd1uLr0ipmGmOYynzShAvfnRs');
