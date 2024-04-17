package net.thedevatlas.hexad;

import net.fabricmc.api.ModInitializer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Hexad implements ModInitializer {
	public static final String MOD_ID = "hexad";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

	@Override
	public void onInitialize() {
		LOGGER.info("The Dev Atlas - Init Hexad Program! - Online");
	}
}