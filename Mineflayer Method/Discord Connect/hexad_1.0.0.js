// Jacob McGowan - June 2024 //

// GOAL //
// Build a Discord bot that controls all of the branches for the bots //
// 4 branches + master branch //

// Mining, Crafting, Growing, Building, Stoarge //
// Atlas, Apollo, Hephestus, Icarus, Kratos //
// Each get there own chat section for control, Atlas has master controls //

// Includes //
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const MinecraftData = require('minecraft-data');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalBlock = goals.GoalBlock;
const collectBlock = require('mineflayer-collectblock').plugin;

// Discord Bots //
const Atlas = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});
const Apollo = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});
const Hephestus = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});
const Icarus = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});
const Kratos = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});

// When Bot Turns On, Create A Control Panel //
Atlas.once('ready', () => {
  console.log('Bot is ready!');

  // Find a channel to send the message to (adjust the channel ID accordingly)
  const channel = Atlas.channels.cache.get('1246450791649247342');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('store')
        .setLabel('Store')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('status')
        .setLabel('Status')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    );

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Atlas' Master Control Panel")
    .setDescription("Here's My Available Commands\nStore, Status, Stop\n\n**Made By: thedevatlas and swig4**");
  channel.send({ embeds: [embed], components: [row] });
});

Apollo.once('ready', () => {
  console.log('Bot is ready!');

  // Find a channel to send the message to (adjust the channel ID accordingly)
  const channel = Apollo.channels.cache.get('1246450834196398112');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('mine')
        .setLabel('Mine')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('store')
        .setLabel('Store')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('status')
        .setLabel('Status')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    );

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Apollo's Control Panel")
    .setDescription("Here's My Available Commands\nMine, Store, Status, Stop\n\n**Made By: thedevatlas and swig4**");
  channel.send({ embeds: [embed], components: [row] });
});

Hephestus.once('ready', () => {
  console.log('Bot is ready!');

  // Find a channel to send the message to (adjust the channel ID accordingly)
  const channel = Hephestus.channels.cache.get('1246450847827759134');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('craft')
        .setLabel('Craft')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('store')
        .setLabel('Store')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('status')
        .setLabel('Status')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    );

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Hephestus' Control Panel")
    .setDescription("Here's My Available Commands\nCraft, Store, Status, Stop\n\n**Made By: thedevatlas and swig4**");
  channel.send({ embeds: [embed], components: [row] });
});

Icarus.once('ready', () => {
  console.log('Bot is ready!');

  // Find a channel to send the message to (adjust the channel ID accordingly)
  const channel = Icarus.channels.cache.get('1246450893369376788');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('build')
        .setLabel('Build')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('store')
        .setLabel('Store')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('status')
        .setLabel('Status')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    );

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Icarus' Control Panel")
    .setDescription("Here's My Available Commands\nBuild, Store, Status, Stop\n\n**Made By: thedevatlas and swig4**");
  channel.send({ embeds: [embed], components: [row] });
});

Kratos.once('ready', () => {
  console.log('Bot is ready!');

  // Find a channel to send the message to (adjust the channel ID accordingly)
  const channel = Kratos.channels.cache.get('1246450907101659187');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('fight')
        .setLabel('Fight')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('store')
        .setLabel('Store')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('status')
        .setLabel('Status')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    );

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Kratos' Control Panel")
    .setDescription("Here's My Available Commands\nFight, Store, Status, Stop\n\n**Made By: thedevatlas and swig4**");
  channel.send({ embeds: [embed], components: [row] });
});


// When User Presses Button //
// Master Bot, Can Stop / Change Task of All Bots //
Atlas.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    // Stop ALL Bots //
    case 'stop':
      bots.forEach(bot => bot.stop());
      await interaction.reply('All bots have been stopped.');
      break;

    // Give Status Of ALL Bots //
    case 'status':
      let statusMessage = 'Bot Status:\n';
      bots.forEach((bot, index) => {
        statusMessage += `Bot ${index + 1}: ${bot.getGoal()}\n`;
      });
      await interaction.reply(statusMessage);
      break;

    // Get ALL Bots To Store Items In Storage System //
    case 'store':
      // TODO - All Bots Go Store In Storage System, Stop //
      // bots.forEach((bot, index) => {
      //   bot.storeItems();
      // });
      bots[0].storeItems();
      await interaction.reply(`Bot store items`);
      //await interaction.reply(`Minecraft bot ${newBot.id} created and connected.`);
      break;

    default:
      await interaction.reply('Unknown command');
  }
});

// Mining //
Apollo.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    case 'mine':
      if(bots < 1)
        {
          for (let i = 1; i <= 1; i++) {
            const newBot = new Bot(i);
            bots.push(newBot);
            
          }
        }
        else
        {
          for (let i = 1; i <= 1; i++) {
            bots[i].collectGrass();
          }
    
        }
      
     
      await interaction.reply('Mining bots join');
      break;

    // Stop ALL Bots //
    case 'stop':
      bots.forEach(bot => bot.stop());
      await interaction.reply('All bots have been stopped.');
      break;

    // Give Status Of ALL Bots //
    case 'status':
      let statusMessage = 'Bot Status:\n';
      bots.forEach((bot, index) => {
        statusMessage += `Bot ${index + 1}: ${bot.getGoal()}\n`;
      });
      await interaction.reply(statusMessage);
      break;

    // Get ALL Bots To Store Items In Storage System //
    case 'store':
      // TODO - Mining Bots Go Store Items, Stop //
      await interaction.reply(`Minecraft bot ${newBot.id} created and connected.`);
      break;

    default:
      await interaction.reply('Unknown command');
  }
});

// Crafting / Storage? //
Hephestus.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    // Stop ALL Bots //
    case 'stop':
      bots.forEach(bot => bot.stop());
      await interaction.reply('All bots have been stopped.');
      break;

    // Give Status Of ALL Bots //
    case 'status':
      let statusMessage = 'Bot Status:\n';
      bots.forEach((bot, index) => {
        statusMessage += `Bot ${index + 1}: ${bot.getGoal()}\n`;
      });
      await interaction.reply(statusMessage);
      break;

    // Get ALL Bots To Store Items In Storage System //
    case 'store':
      // TODO - Crafting Bots Go Store Items, Stop //
      await interaction.reply(`Minecraft bot ${newBot.id} created and connected.`);
      break;

    default:
      await interaction.reply('Unknown command');
  }
});

// Building //
Icarus.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    // Stop ALL Bots //
    case 'stop':
      bots.forEach(bot => bot.stop());
      await interaction.reply('All bots have been stopped.');
      break;

    // Give Status Of ALL Bots //
    case 'status':
      let statusMessage = 'Bot Status:\n';
      bots.forEach((bot, index) => {
        statusMessage += `Bot ${index + 1}: ${bot.getGoal()}\n`;
      });
      await interaction.reply(statusMessage);
      break;

    // Get ALL Bots To Store Items In Storage System //
    case 'store':
      // TODO - Builders Store Items, Stop //
      await interaction.reply(`Minecraft bot ${newBot.id} created and connected.`);
      break;

    default:
      await interaction.reply('Unknown command');
  }
});

// Fighting / Gathering Mobs? //
Kratos.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    // Stop ALL Bots //
    case 'stop':
      bots.forEach(bot => bot.stop());
      await interaction.reply('All bots have been stopped.');
      break;

    // Give Status Of ALL Bots //
    case 'status':
      let statusMessage = 'Bot Status:\n';
      bots.forEach((bot, index) => {
        statusMessage += `Bot ${index + 1}: ${bot.getGoal()}\n`;
      });
      await interaction.reply(statusMessage);
      break;

    // Get Fighters Bots To Store Items In Storage System //
    case 'store':
      // TODO - Fighters Store Items, Stop //
      await interaction.reply(`Minecraft bot ${newBot.id} created and connected.`);
      break;

    default:
      await interaction.reply('Unknown command');
  }
});

// Discord Tokens / Start Bot //
Atlas     .login('');
Apollo    .login('');
Hephestus .login('');
Icarus    .login('');
Kratos    .login('');


// -------------------------------------------------- //

// Minecraft Bots //
const bots = [];

// Chest locations for storage //
const chests = [
  { x:-156, y:64, z:78}
  //{ x: 200, y: 64, z: 200 },
];

class Bot {
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

    this.bot.on('goal_reached', async () => {
      const chestBlock = this.bot.findBlock({
        matching: (block) => block && block.name === 'chest',
        maxDistance: 64 // Adjust this value as needed
      });
      
      if (chestBlock) {
        console.log("Chest is here");
        this.bot.openChest(chestBlock)
          .then(chest => {
            const itemsToDeposit = this.bot.inventory.items();
            console.log(`Items to deposit: ${itemsToDeposit.map(item => `${item.count}x ${item.name}`).join(", ")}`);
            
            itemsToDeposit.forEach(item => {
              chest.deposit(item.type, null, item.count, null);
              // chest.deposit(item.type, null, item.count, (err) => {
              //   if (err) {
              //     console.log(`Error depositing ${item.name}: ${err}`);
              //   } else {
              //     console.log(`Deposited ${item.count} items of ${item.name}`);
              //   }
              // });
            });
      
            // chest.close();
          })
          .catch(err => {
            console.error(`Error opening chest: ${err}`);
          });
      } else {
        console.log("No chest found within range.");
      }
    });
  }

  setGoal(goal) {
    this.goal = goal;
  }

  getGoal() {
    return this.goal;
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

  async collectGrass() {
    // Correct the undefined 'mcData' reference. Assuming MinecraftData is imported and assigned to 'mcData'.
    const mcData = MinecraftData(this.bot.version);
  
    // Find a nearby grass block
    const grass = this.bot.findBlock({
      matching: mcData.blocksByName.grass_block.id,
      maxDistance: 64
    });
  
    if (grass) {
      // If we found one, try to collect it.
      try {
        await this.bot.collectBlock.collect(grass);
        // Optionally, call collectGrass() again if you want to keep collecting.
        // You should add a condition to stop or you might call this indefinitely.
        // Example: if (condition) await this.collectGrass();
      } catch (err) {
        console.log(err); // Log any errors
      }
    } else {
      console.log('No grass block found to collect.');
    }
  }

  stop() {
    this.bot.quit('Stopped by Discord command');
    this.setGoal('Stopped');
  }
  async collectGrass() {
    // Find a nearby grass block
    const grass = this.bot.findBlock({
      matching: mcData.blocksByName.grass_block.id,
      maxDistance: 64
    })
  
    if (grass) {
      // If we found one, collect it.
      try {
        await this.bot.collectBlock.collect(grass)
        collectGrass() // Collect another grass block
      } catch (err) {
        console.log(err) // Handle errors, if any
      }
    }
  }

  storeItems()
  {

    const nearestChest = chests.reduce((prev, curr) => {
      const prevDist = bot.entity.position.distanceTo(prev);
      const currDist = bot.entity.position.distanceTo(curr);
      return (prevDist < currDist) ? prev : curr;
    });

    this.bot.pathfinder.goto(new GoalBlock(nearestChest.x, nearestChest.y + 1, nearestChest.z));

    
  }
}

// Spawning multiple bots
// const botCount = 1; // Number of bots you want to spawn
// for (let i = 1; i <= botCount; i++) {
//   bots.push(new Bot(i));
// }