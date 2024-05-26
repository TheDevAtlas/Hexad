const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').mineflayer

const bots = [];
const connectionInterval = 2000; // Delay in milliseconds between bot connections

// Function to create a bot
function createBot(index) {
  const bot = mineflayer.createBot({
    host: 'localhost',
    username: `Bot${index}`,
    //auth: 'offline',
    port: 25565,
  });

  bot.once('spawn', () => {
    // const x = (index % gridSize) * gridSpacing;
    // const z = Math.floor(index / gridSize) * gridSpacing;
    // bot.chat(`Moving to position ${x}, ${z}`);
    // // Assuming flat terrain and ignoring y for simplicity
    // bot.entity.position.x = 0;
    // bot.entity.position.z = 0;
    bot.chat(`I have joined`);
    bot.attack(bot.nearestEntity);
  });

  // bot.on('chat', (username, message) => {
  //   if (username === bot.username) return;
  //   bot.chat(message);
  // });

  // bot.on('kicked', (reason) => console.log(`Bot${index} was kicked: ${reason}`));
  // bot.on('error', console.log);

  // bots.push(bot);

  // bot.once('spawn', () => {
  //   mineflayerViewer(bot, { port: 3007+index, firstPerson: false })
  // })
}

// Create 25 bots with a delay
for (let i = 0; i < 25; i++) {
  setTimeout(() => {
    createBot(i);
  }, i * connectionInterval);
}
