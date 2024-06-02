const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock').plugin

let botArgs = {
    host: 'localhost',
    port: '25565',
};

class MCBot {

    // Constructor
    constructor(username) {
        this.username = username;
        this.host = botArgs["host"];
        this.port = botArgs["port"];

        this.initBot();
    }

    // Init bot instance
    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
        });

        this.bot.loadPlugin(pathfinder)
        this.bot.loadPlugin(collectBlock)

        this.initEvents()
    }

    // Init bot events
    initEvents() {
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            console.log(`[${this.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
        });

        this.bot.on('end', (reason) => {
            console.log(`[${this.username}] Disconnected: ${reason}`);
    
            if (reason == "disconnect.quitting") {
                return
            }
    
            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000);
        });

        this.bot.on('spawn', async () => {
            console.log(`[${this.username}] Spawned in`);
            this.bot.chat("Hello!");
    
            await this.bot.waitForTicks(60);


            // this.bot.chat("Goodbye");
            // this.bot.quit();
        });

        this.bot.on('error', (err) => {
            if (err.code == 'ECONNREFUSED') {
                console.log(`[${this.username}] Failed to connect to ${err.address}:${err.port}`)
            }
            else {
                console.log(`[${this.username}] Unhandled error: ${err}`);
            }
        });

        this.bot.on('chat', async (username, message) => {
            const args = message.split(' ')
            if (args[0] !== 'collect') return
          
            const blockType = this.bot.registry.blocksByName[args[1]]
            if (!blockType) {
              this.bot.chat("I don't know any blocks with that name.")
              return
            }
          
            this.bot.chat('Collecting the nearest ' + blockType.name)
          
            while (true) {
                const block = this.bot.findBlock({
                  matching: blockType.id,
                  maxDistance: 64
                })
            
                if (!block) {
                  this.bot.chat("I don't see that block nearby.")
                  return
                }
            
                await this.bot.collectBlock.collect(block);
                
              }
          })
          
          
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function spawnBots()
{
    let bots = [];
    for(var i = 0; i < 25; i++) {
        let newBot = new MCBot(`collector ${i}`)
        bots.push(newBot)
        await sleep(1000);
        
    }
}

spawnBots();