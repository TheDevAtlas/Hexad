// https://github.com/PrismarineJS/mineflayer/blob/master/examples/collectblock.js

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock').plugin
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'collector',
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(collectBlock)

bot.on('chat', (username, message) => {
  const args = message.split(' ')
  if (args[0] !== 'collect') return

  const blockType = bot.registry.blocksByName[args[1]]
  if (!blockType) {
    bot.chat("I don't know any blocks with that name.")
    return
  }

  bot.chat('Collecting the nearest ' + blockType.name)

  processLoop(blockType)
})

// modified to run over and over again //
async function processLoop(blockType) {
  while (true) {

    const block = bot.findBlock({
      matching: blockType.id,
      maxDistance: 64
    })

    if (!block) {
      bot.chat("I don't see that block nearby.")
      return
    }

    bot.collectBlock.collect(block);
    await delay(2000);
  }
}