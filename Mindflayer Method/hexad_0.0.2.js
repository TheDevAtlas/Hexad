const mineflayer = require('mineflayer');
const {pathfinder, Movements, goals} = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;
//const minecraftData = require('minecraft-data');

const bots = [];
const connectionInterval = 1000; // Delay in milliseconds between bot connections

// Function to create a bot
function createBot(index) {
  const bot = mineflayer.createBot({
    host: 'localhost',
    username: `Bot${index}`,
    port: 25565,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    bot.chat(`I have joined`);

    const player = bot.players['TheDevAtlas'];

    if(!player){
      return;
    }

    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    const goal = new GoalFollow(player.entity);
    bot.pathfinder.setGoal(goal, true);
  });

  bots.push(bot);
}

for (let i = 0; i < 1; i++) {
  setTimeout(() => {
    createBot(i);
  }, i * connectionInterval);
}
