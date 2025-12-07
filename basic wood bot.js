const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder')
const { goals } = pathfinder
const collectBlock = require('mineflayer-collectblock')

const bot = mineflayer.createBot({
  host: 'localhost', // minecraft server ip
  username: 'Bot', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  //auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
  port: 55886              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

bot.loadPlugin(pathfinder.pathfinder)
bot.loadPlugin(collectBlock.plugin)

let mcData
let logCount = 0

function getLogCount() {
  const logs = bot.inventory.items().find(item => item.name === 'acacia_log')
  return logs ? logs.count : 0
}

async function collectLog() {
  const acaciaLog = bot.findBlock({
    matching: mcData.blocksByName.acacia_log.id,
    maxDistance: 128
  })
  if (!acaciaLog) {
    bot.chat('No acacia log found nearby, searching again in 5 seconds')
    setTimeout(collectLog, 5000)
    return
  }
  try {
    await bot.collectBlock.collect(acaciaLog)
    logCount = getLogCount()
    bot.chat(`Collected acacia log. Total: ${logCount}`)
    if (logCount >= 10) {
      await depositLogs()
      logCount = getLogCount()
    } else {
      setTimeout(collectLog, 1000)
    }
  } catch (err) {
    console.log(err)
    setTimeout(collectLog, 1000) // Retry after error
  }
}

async function depositLogs() {
  try {
    // Go to the storage system location first
    await bot.pathfinder.goto(new goals.GoalNear(-861, 69, 164, 3))
    
    const chest = bot.findBlock({
      matching: mcData.blocksByName.chest.id,
      maxDistance: 10
    })
    if (!chest) {
      bot.chat('No chest found at storage location')
      return
    }
    const chestBlock = await bot.openChest(chest)
    const lopC = getLogCount()
    await chestBlock.deposit(mcData.itemsByName.acacia_log.id, null, lopC)
    chestBlock.close()
    bot.chat('Deposited '+lopC+' acacia logs into chest')
    setTimeout(collectLog, 1000)
  } catch (err) {
    console.log(err)
    bot.chat('Failed to deposit logs into chest')
  }
}

bot.once('spawn', async () => {
  mcData = require('minecraft-data')(bot.version)
  await collectLog()
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  bot.chat(message)
  mcData = require('minecraft-data')(bot.version)
  await collectLog()
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)