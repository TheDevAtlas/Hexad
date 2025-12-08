const mineflayer = require('mineflayer')

// Choose a short Greek god name
const name = 'Zeus'
const dropItem = true;

const bot = mineflayer.createBot({
  host: 'localhost', // Change to your server IP if needed
  username: name, // Bot's username
  version: '1.21.8', // Specify Minecraft version
  auth: 'offline' // Use 'microsoft' for online servers
})

bot.once('spawn', () => {
  bot.chat(`Hello, I am ${name}`)
})

// Craft item function
async function craftItem(itemName, count) {
  const mcData = require('minecraft-data')(bot.version)
  const item = mcData.itemsByName[itemName]
  if (!item) {
    bot.chat(`Unknown item: ${itemName}`)
    return
  }
  const recipes = bot.recipesFor(item.id, null, count, null)
  if (recipes.length === 0) {
    bot.chat(`No recipe found for ${itemName}`)
    return
  }
  try {
    await bot.craft(recipes[0], count, null)
    const craftedItem = bot.inventory.items().find(i => i.name === itemName)
    if (craftedItem) {
      if (dropItem) {
        bot.chat(`Crafted ${count} ${itemName}`)
      } else {
        await bot.tossStack(craftedItem)
        bot.chat(`Crafted and tossed ${count} ${itemName}`)
      }
    } else {
      bot.chat(`Crafted ${count} ${itemName}, but could not find it to toss.`)
    }
  } catch (err) {
    bot.chat(`Failed to craft ${itemName}: ${err.message}`)
  }
}

// Listen for chat messages and craft requested items
bot.on('chat', async (username, message) => {
  if (username === bot.username) return // Ignore bot's own messages
  const parts = message.trim().split(/\s+/)
  // Check for 'craft' command
  if (parts[0].toLowerCase() === 'craft' && parts.length >= 2) {
    const itemName = parts[1]
    const count = parts.length > 2 && !isNaN(Number(parts[2])) ? Number(parts[2]) : 1
    await craftItem(itemName, count)
    return
  }
})

// Log errors and kick reasons
bot.on('kicked', console.log)
bot.on('error', console.log)

//---//

