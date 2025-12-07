// Zeus V3.2 — Fully patched for Minecraft 1.21.x tool renames
// Supports: mineflayer, pathfinder, collectBlock, tools, armor, auto-eat, baritone

const mineflayer = require("mineflayer")
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder")
const collectBlock = require("mineflayer-collectblock").plugin
const toolPlugin = require("mineflayer-tool").plugin
const armorManager = require("mineflayer-armor-manager")
const { Vec3 } = require("vec3")

let mcData
let running = false
let tableBlock = null

// -----------------------------------------------------
// BOT SETUP
// -----------------------------------------------------
const bot = mineflayer.createBot({
  host: process.env.MC_HOST || "localhost",
  port: Number(process.env.MC_PORT || 25565),
  username: "Zeus",
  auth: process.env.MC_AUTH || "offline",
  version: "1.21.8",
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(collectBlock)
bot.loadPlugin(toolPlugin)
bot.loadPlugin(armorManager)

// Auto-eat (ESM dynamic import)
;(async () => {
  try {
    const mod = await import("mineflayer-auto-eat")
    bot.loadPlugin(mod.default ?? mod.loader ?? mod)
  } catch (err) {
    console.log("auto-eat error:", err)
  }
})()

// Optional viewer
try {
  const { mineflayer: viewer } = require("prismarine-viewer")
  bot.once("spawn", () => viewer(bot, { port: 3007, firstPerson: true }))
} catch {}

// Optional Baritone
try {
  bot.loadPlugin(require("mineflayer-baritone").plugin)
} catch {}

bot.once("spawn", () => {
  mcData = require("minecraft-data")(bot.version)
  bot.pathfinder.setMovements(new Movements(bot, mcData))

  bot.autoEat.options = {
    priority: "foodPoints",
    startAt: 14,
    bannedFood: ["rotten_flesh", "pufferfish"],
  }

  bot.chat("Zeus V3.2 online. Commands: start / stop / home")
})

// -----------------------------------------------------
// COMMANDS
// -----------------------------------------------------
bot.on("chat", (user, msg) => {
  msg = msg.toLowerCase().trim()
  if (msg === "start") start()
  if (msg === "stop") stopBot()
  if (msg === "home") followUser("TheDevAtlas")
})

// -----------------------------------------------------
// UTILITIES
// -----------------------------------------------------
function count(name) {
  return bot.inventory
    .items()
    .filter((i) => i.name === name)
    .reduce((s, i) => s + i.count, 0)
}

// Detect correct pickaxe item for 1.21+ (oak_pickaxe)
function getWoodPickaxeName() {
  const names = Object.keys(mcData.itemsByName)
  return (
    names.find((n) => n.endsWith("_pickaxe") && n.startsWith("oak")) ||
    names.find((n) => n.includes("pickaxe"))
  )
}

function findCraftingTableNearby() {
  return bot.findBlock({
    matching: mcData.blocksByName.crafting_table.id,
    maxDistance: 6,
  })
}

// Open crafting table window
async function openCraftingTable() {
  if (!tableBlock) {
    tableBlock = findCraftingTableNearby()
    if (!tableBlock) throw new Error("No crafting table found.")
  }
  return await bot.openBlock(tableBlock)
}

// Craft intelligently (hand or table)
async function craftItem(itemName, amount = 1) {
  const item = mcData.itemsByName[itemName]
  if (!item) throw new Error(`Unknown item: ${itemName}`)

  // First check hand (2x2) recipes
  const handRecipes = bot.recipesFor(item.id, null, amount, null)
  if (handRecipes && handRecipes.length) {
    const handRecipe = handRecipes.find((r) => !r.requiresTable) || handRecipes[0]
    await bot.craft(handRecipe, amount, null)
    return
  }

  // If no hand recipe, try crafting using a table (3x3)
  const table = await openCraftingTable()
  const tableRecipes = bot.recipesFor(item.id, null, amount, table)

  if (!tableRecipes.length) {
    table.close()
    throw new Error(`No recipe exists for: ${itemName}`)
  }

  await bot.craft(tableRecipes[0], amount, table)
  table.close()
}

// -----------------------------------------------------
// PIPELINE
// -----------------------------------------------------
async function start() {
  if (running) return bot.chat("Already running.")
  running = true

  bot.chat("Starting Zeus startup...")

  try {
    await pipeline([
      ensureLogs,
      ensurePlanks,
      ensureCraftingTableItem,
      placeCraftingTable,
      ensureSticks,
      ensurePickaxe,
      mineStarterStone,
    ])
    bot.chat("Startup complete.")
  } catch (err) {
    bot.chat("Error: " + err.message)
  }

  running = false
}

function stopBot() {
  running = false
  bot.pathfinder.stop()
  if (bot.collectBlock?.isCollecting) bot.collectBlock.cancelTask()
  bot.chat("Stopped all tasks.")
}

function followUser(name) {
  const target = bot.players[name]?.entity
  if (target) {
    bot.pathfinder.setGoal(new goals.GoalFollow(target, 1), true)
    bot.chat("Following " + name)
  } else bot.chat("User not found.")
}

async function pipeline(steps) {
  for (const step of steps) {
    if (!running) return
    await step()
  }
}

// -----------------------------------------------------
// STEP 1 — Collect logs
// -----------------------------------------------------
async function ensureLogs() {
  if (bot.inventory.items().some((i) => i.name.endsWith("_log"))) return

  bot.chat("Collecting logs...")
  const targets = bot.findBlocks({
    matching: (b) => b?.name.includes("log"),
    count: 4,
    maxDistance: 32,
  })

  if (!targets.length) throw new Error("No logs nearby.")

  await bot.collectBlock.collect(targets.map((p) => bot.blockAt(p)))
}

// -----------------------------------------------------
// STEP 2 — Planks
// -----------------------------------------------------
async function ensurePlanks() {
  if (bot.inventory.items().some((i) => i.name.endsWith("_planks"))) return

  const log = bot.inventory.items().find((i) => i.name.endsWith("_log"))
  if (!log) throw new Error("No logs to craft planks.")

  const plankName = log.name.replace("_log", "_planks")

  bot.chat("Crafting planks...")
  await craftItem(plankName, 2)
}

// -----------------------------------------------------
// STEP 3 — Crafting Table
// -----------------------------------------------------
async function ensureCraftingTableItem() {
  if (count("crafting_table") > 0) return
  bot.chat("Crafting crafting table...")
  await craftItem("crafting_table", 1)
}

// -----------------------------------------------------
// STEP 4 — Place table
// -----------------------------------------------------
async function placeCraftingTable() {
  const found = findCraftingTableNearby()
  if (found) {
    tableBlock = found
    return
  }

  bot.chat("Placing crafting table...")

  const item = bot.inventory.findInventoryItem(
    mcData.itemsByName.crafting_table.id,
    null
  )

  if (!item) throw new Error("No crafting table in inventory.")

  const base = bot.entity.position.floored()
  const offsets = [
    new Vec3(1, -1, 0),
    new Vec3(-1, -1, 0),
    new Vec3(0, -1, 1),
    new Vec3(0, -1, -1),
  ]

  for (const off of offsets) {
    const block = bot.blockAt(base.plus(off))
    if (!block || block.boundingBox === "empty") continue

    await bot.equip(item, "hand")
    await bot.placeBlock(block, new Vec3(0, 1, 0))
    await bot.waitForTicks(5)

    const tbl = findCraftingTableNearby()
    if (tbl) {
      tableBlock = tbl
      bot.chat("Crafting table placed.")
      return
    }
  }

  throw new Error("Failed to place crafting table.")
}

// -----------------------------------------------------
// STEP 5 — Sticks
// -----------------------------------------------------
async function ensureSticks() {
  if (count("stick") > 0) return
  bot.chat("Crafting sticks...")
  await craftItem("stick", 1)
}

// -----------------------------------------------------
// STEP 6 — Pickaxe (1.21 renamed → oak_pickaxe)
// -----------------------------------------------------
async function ensurePickaxe() {
  const detected = getWoodPickaxeName() // auto-detect preferred name

  if (count(detected) > 0) return

  bot.chat("Crafting wooden (oak) pickaxe...")

  // Build candidate list
  const allPickaxeNames = Object.keys(mcData.itemsByName).filter((n) => n.includes("pickaxe"))
  const candidates = Array.from(new Set([detected, "oak_pickaxe", "wooden_pickaxe", ...allPickaxeNames])).filter(Boolean)
  console.log('DEBUG: pickaxe candidates ->', candidates)

  for (const name of candidates) {
    const item = mcData.itemsByName[name]
    if (!item) continue

    // Check hand (2x2) recipes
    const handRecipes = bot.recipesFor(item.id, null, 1, null)
    console.log(`DEBUG: hand recipes for ${name} -> ${handRecipes.length}`)
    if (handRecipes.length > 0) {
      try {
        await craftItem(name, 1)
        bot.chat(`Crafted pickaxe: ${name}`)
        return
      } catch (err) {
        console.log(`DEBUG: craft attempt for ${name} failed:`, err && err.message ? err.message : err)
        continue
      }
    }

    // Check table (3x3) recipes using existing tableBlock or nearby table
    const tbl = tableBlock || findCraftingTableNearby()
    if (tbl) {
      const tableRecipes = bot.recipesFor(item.id, null, 1, tbl)
      console.log(`DEBUG: table recipes for ${name} -> ${tableRecipes.length}`)
      if (tableRecipes.length > 0) {
        try {
          await craftItem(name, 1)
          bot.chat(`Crafted pickaxe: ${name}`)
          return
        } catch (err) {
          console.log(`DEBUG: craft attempt for ${name} failed:`, err && err.message ? err.message : err)
          continue
        }
      }
    } else {
      console.log('DEBUG: no crafting table available to check table recipes')
    }
  }

  throw new Error(`Pickaxe recipe not found for candidates: ${candidates.join(', ')}`)
}

// -----------------------------------------------------
// STEP 7 — Mine Stone
// -----------------------------------------------------
async function mineStarterStone() {
  bot.chat("Mining stone...")

  const pickaxeName = getWoodPickaxeName()
  const pick = bot.inventory.findInventoryItem(mcData.itemsByName[pickaxeName].id)

  if (!pick) throw new Error("Pickaxe missing.")

  await bot.equip(pick, "hand")

  const targets = bot.findBlocks({
    matching: (b) => b?.name === "stone",
    count: 3,
    maxDistance: 32,
  })

  if (!targets.length) throw new Error("No stone nearby.")

  await bot.collectBlock.collect(targets.map((p) => bot.blockAt(p)))
}

// -----------------------------------------------------
bot.on("error", console.log)
bot.on("kicked", console.log)
