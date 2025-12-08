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

// Listen for chat messages and craft requested items
bot.on('chat', async (username, message) => {
  if (username === bot.username) return // Ignore bot's own messages
  // Parse item name and count from message
  const parts = message.trim().split(/\s+/)
  const itemName = parts[0]
  const count = parts.length > 1 && !isNaN(Number(parts[1])) ? Number(parts[1]) : 1
  const mcData = require('minecraft-data')(bot.version)
  const item = mcData.itemsByName[itemName]
  if (!item) {
    bot.chat(`Unknown item: ${itemName}`)
    return
  }
  // Find a recipe for the item
  const recipes = bot.recipesFor(item.id, null, count, null)
  if (recipes.length === 0) {
    bot.chat(`No recipe found for ${itemName}`)
    return
  }
  try {
    await bot.craft(recipes[0], count, null)
    // Find the crafted item in inventory
    const craftedItem = bot.inventory.items().find(i => i.name === itemName)
    if (craftedItem) {
        if (dropItem)
        {
            bot.chat(`Crafted ${count} ${itemName}`)
        }
        else
        {
            await bot.tossStack(craftedItem)
            bot.chat(`Crafted and tossed ${count} ${itemName}`)   
        }
      
    } else {
      bot.chat(`Crafted ${count} ${itemName}, but could not find it to toss.`)
    }
  } catch (err) {
    bot.chat(`Failed to craft ${itemName}: ${err.message}`)
  }
})

// Log errors and kick reasons
bot.on('kicked', console.log)
bot.on('error', console.log)

//---//

