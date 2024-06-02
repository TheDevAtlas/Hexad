const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const collectBlock = require('mineflayer-collectblock').plugin;
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Discord bot setup
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const authorizedUsers = ['514427159637655552', 'YourDiscordUserID2']; // Replace with actual Discord user IDs

discordClient.once('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('messageCreate', async message => {
  if (!authorizedUsers.includes(message.author.id)) return;

  if (message.content === 'spawn bot') {
    const button = new ButtonBuilder()
      .setCustomId('create-bot')
      .setLabel('Create Minecraft Bot')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.reply({ content: 'Click to create a Minecraft bot:', components: [row] });
  }
});

discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'create-bot') {
    const botId = bots.length + 1;
    const newBot = new CollectorBot(botId);
    bots.push(newBot);
    await interaction.reply(`Minecraft bot ${botId} created and connected.`);
  }
});

discordClient.login('MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gs6JDq.eEFidJ4tsTvESqd1uLr0ipmGmOYynzShAvfnRs'); // Replace with your Discord bot token

class CollectorBot {
  constructor(id) {
    this.bot = mineflayer.createBot({
      host: 'localhost',
      port: 25565,
      username: 'collector' + id,
    });

    this.id = id;

    this.bot.loadPlugin(pathfinder);
    this.bot.loadPlugin(collectBlock);

    this.bot.on('chat', (username, message) => {
      const args = message.split(' ');
      if (args[0] !== 'collect') return;
      this.handleCollectCommand(args[1]);
    });

    this.bot.on('kicked', console.log);
    this.bot.on('error', console.log);
    this.bot.on('path_update', (result) => {
      if (result.status === 'noPath') {
        this.bot.chat("I can't find a path to the goal!");
      }
    });
  }

  handleCollectCommand(blockTypeName) {
    const blockType = this.bot.registry.blocksByName[blockTypeName];
    if (!blockType) {
      this.bot.chat("I don't know any blocks with that name.");
      return;
    }

    this.bot.chat('Collecting the nearest ' + blockType.name);
    this.processLoop(blockType);
  }

  async processLoop(blockType) {
    while (true) {
      try {
        await delay(500 * this.id);

        const block = this.bot.findBlock({
          matching: blockType.id,
          maxDistance: 64
        });

        if (!block) {
          this.bot.chat("I don't see that block nearby.");
          return;
        }

        if (this.bot.pathfinder.goal?.isEnd) continue;

        this.bot.collectBlock.collect(block);
        await delay(2000);
      } catch (error) {
        if (error.message.includes('Took too long to decide path to goal!')) {
          this.bot.chat("I'm having trouble finding a path to the goal. I'll try again.");
        } else {
          console.error(error);
        }
      }
    }
  }
}

// Spawning multiple bots
const bots = [];
