const mineflayer = require('mineflayer');
//const mineflayerViewer = require('prismarine-viewer').mineflayer

const bots = [];
const connectionInterval = 100; // Delay in milliseconds between bot connections

// Function to create a bot
function createBot(index) {
  const bot = mineflayer.createBot({
    host: 'localhost',
    username: `Bot${index}`,
    //auth: 'offline',
    port: 25565,
  });

  bot.once('spawn', () => {
    bot.chat(`I have joined`);
    bot.attack(bot.nearestEntity);
  });

  bots.push(bot);

  // bot.once('spawn', () => {
  //   mineflayerViewer(bot, { port: 3007+index, firstPerson: false })
  // })
}

for (let i = 0; i < 25; i++) {
  setTimeout(() => {
    createBot(i);
  }, i * connectionInterval);
}
