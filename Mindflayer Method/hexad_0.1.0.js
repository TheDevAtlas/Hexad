// Control all bots using general command // - collect oak_log

const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock').plugin
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class CollectorBot {
  constructor(id) {
    this.bot = mineflayer.createBot({
      host: 'localhost',
      port: 25565,
      username: 'collector'+id,
    })

    this.id = id;

    this.bot.loadPlugin(pathfinder)
    this.bot.loadPlugin(collectBlock)

    this.bot.on('chat', (username, message) => {
      const args = message.split(' ')
      if (args[0] !== 'collect') return

      const blockType = this.bot.registry.blocksByName[args[1]]
      if (!blockType) {
        this.bot.chat("I don't know any blocks with that name.")
        return
      }

      this.bot.chat('Collecting the nearest ' + blockType.name)
      this.processLoop(blockType, this.id)
    })

    this.bot.on('kicked', console.log)
    this.bot.on('error', console.log)
  }

  async processLoop(blockType, id) {
    while (true) {
      await delay(500 * id);

      const block = this.bot.findBlock({
        matching: blockType.id,
        maxDistance: 64
      })

      if (!block) {
        this.bot.chat("I don't see that block nearby.")
        return
      }

      if(this.bot.pathfinder.goal.isEnd)

      this.bot.collectBlock.collect(block);
      await delay(2000);
    }
  }
}

// Spawning multiple bots
const botCount = 5; // Number of bots you want to spawn
for (let i = 1; i <= botCount; i++) {
  new CollectorBot(i);
}
