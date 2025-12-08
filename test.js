const mineflayer = require('mineflayer')

// Choose a short Greek god name
const name = 'Zeus'
const dropItem = false;

const bot = mineflayer.createBot({
  host: 'localhost', // Change to your server IP if needed
  username: name, // Bot's username
  version: '1.21.8', // Specify Minecraft version
  auth: 'offline' // Use 'microsoft' for online servers
})

bot.once('spawn', () => {
  bot.chat(`Hello, I am ${name}`)
})

// Find nearest crafting table block
function findNearestCraftingTable() {
  const mcData = require('minecraft-data')(bot.version)
  const craftingTableId = mcData.blocksByName.crafting_table.id
  const block = bot.findBlock({
    matching: craftingTableId,
    maxDistance: 16
  })
  return block
}

// Craft item function
async function craftItem(itemName, count) {
  const mcData = require('minecraft-data')(bot.version)
  const item = mcData.itemsByName[itemName]
  if (!item) {
    bot.chat(`Unknown item: ${itemName}`)
    return
  }
  let craftingTable = null
  let recipes = bot.recipesFor(item.id, null, count, null)
  // If no recipe found, try with crafting table
  if (recipes.length === 0) {
    craftingTable = findNearestCraftingTable()
    if (!craftingTable) {
      bot.chat('No crafting table nearby!')
      return
    }
    recipes = bot.recipesFor(item.id, null, count, craftingTable)
    if (recipes.length === 0) {
      bot.chat(`No recipe found for ${itemName}`)
      return
    }
  }
  const recipe = recipes[0]
  // If recipe requires table, make sure we have one
  if (recipe.requiresTable) {
    craftingTable = findNearestCraftingTable()
    if (!craftingTable) {
      bot.chat('No crafting table nearby!')
      return
    }
  } else {
    craftingTable = null
  }
  try {
    // Move bot to crafting table if needed
    if (craftingTable) {
      // Ensure pathfinder plugin is loaded
      if (!bot.pathfinder) {
        const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
        bot.loadPlugin(pathfinder)
      }
      const { Movements, goals } = require('mineflayer-pathfinder')
      const mcData = require('minecraft-data')(bot.version)
      const movements = new Movements(bot, mcData)
      bot.pathfinder.setMovements(movements)
      // Find a safe adjacent position next to the crafting table
      const pos = craftingTable.position
      const offsets = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 }
      ]
      let targetPos = null
      for (const offset of offsets) {
        const checkPos = pos.offset(offset.x, offset.y, offset.z)
        const block = bot.blockAt(checkPos)
        if (block && block.boundingBox === 'block' && block.name === 'air') {
          targetPos = checkPos
          break
        }
      }
      if (!targetPos) targetPos = pos.offset(1, 0, 0) // fallback
      await bot.pathfinder.goto(new goals.GoalBlock(targetPos.x, targetPos.y, targetPos.z))
    }
    await bot.craft(recipe, count, craftingTable)
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

// Mine item function
async function mineItem(itemName, count) {
  const mcData = require('minecraft-data')(bot.version)
  const blockData = mcData.blocksByName[itemName]
  if (!blockData) {
    bot.chat(`Unknown block: ${itemName}`)
    return
  }
  // Ensure pathfinder plugin is loaded
  if (!bot.pathfinder) {
    const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
    bot.loadPlugin(pathfinder)
  }
  const { Movements, goals } = require('mineflayer-pathfinder')
  const movements = new Movements(bot, mcData)
  bot.pathfinder.setMovements(movements)

  let mined = 0
  let mining = false

  async function mineNext() {
    if (mined >= count) {
      bot.chat(`Mined ${mined} ${itemName}`)
      return
    }
    // Find nearest block
    const block = bot.findBlock({
      matching: blockData.id,
      maxDistance: 32
    })
    if (!block) {
      bot.chat(`No ${itemName} nearby!`)
      return
    }
    mining = true
    try {
      await bot.pathfinder.goto(new goals.GoalBlock(block.position.x, block.position.y, block.position.z))
      await bot.dig(block)
      mined++
      mining = false
      setTimeout(mineNext, 300) // Small delay to allow block updates
    } catch (err) {
      bot.chat(`Failed to mine ${itemName}: ${err.message}`)
      mining = false
    }
  }
  mineNext()
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
  // Check for 'mine' command
  if (parts[0].toLowerCase() === 'mine' && parts.length >= 2) {
    const itemName = parts[1]
    const count = parts.length > 2 && !isNaN(Number(parts[2])) ? Number(parts[2]) : 1
    await mineItem(itemName, count)
    return
  }
})

// Log errors and kick reasons
bot.on('kicked', console.log)
bot.on('error', console.log)

//---//

