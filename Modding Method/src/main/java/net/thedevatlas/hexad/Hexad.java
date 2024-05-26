package net.thedevatlas.hexad;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.EnumSet;

// Icarus - MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gm3K6_.8BOr2edNcooPGV1gTlyiiGO4LaMUEmc9MbtKmU
//

public class Hexad implements ModInitializer {
	public static final String MOD_ID = "hexad";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

	public static final String token = "MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gm3K6_.8BOr2edNcooPGV1gTlyiiGO4LaMUEmc9MbtKmU";

	// Runs when the game opens //
	@Override
	public void onInitialize() {
		LOGGER.info("The Dev Atlas - Init Hexad Program! - Online");

		try{
			DiscordBot.RunBot();
		}
		catch (Exception e)
		{

		}

	}
}