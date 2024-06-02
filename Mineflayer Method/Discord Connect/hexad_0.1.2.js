// Discord bot version, send commands through discord instead of minecraft

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock').plugin
const { Client, GatewayIntentBits } = require('discord.js')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Discord bot setup
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const authorizedUsers = ['514427159637655552', 'haven id']; // Replace with actual Discord user IDs

discordClient.once('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('messageCreate', message => {
  if (!authorizedUsers.includes(message.author.id)) return;

  const args = message.content.split(' ');
  if (args[0] !== 'collect') return;

  const botId = args[1] === 'bot' ? parseInt(args[2]) : null;
  const blockType = args[1] === 'bot' ? args[3] : args[1];

  if (botId) {
    bots[botId - 1]?.handleCollectCommand(blockType);
  } else {
    bots.forEach(bot => bot.handleCollectCommand(blockType));
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

      if (args[1] == 'bot') {
        if (args[2] == id) {
          this.handleCollectCommand(args[3]);
        }
      } else {
        this.handleCollectCommand(args[1]);
      }
    });

    this.bot.on('kicked', console.log);
    this.bot.on('error', console.log);
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
    }
  }
}

// Spawning multiple bots
const botCount = 5; // Number of bots you want to spawn
const bots = [];
for (let i = 1; i <= botCount; i++) {
  bots.push(new CollectorBot(i));
}
