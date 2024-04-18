package net.thedevatlas.hexad;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import net.minecraft.text.Text;

public class HexadClient implements ClientModInitializer {
    @Override
    public void onInitializeClient()
    {

        // When A Client Joins A Minecraft World //
        ClientPlayConnectionEvents.JOIN.register((handler, sender, client) -> {
            // sendCommand("#mine oak_log"); // Send command to Discord or external service
            if (client.player != null) {
                // handler.sendChatMessage("#mine oak_log"); // Send command in Minecraft
                client.player.sendMessage(Text.literal("Hello There"), false); // Send chat message in Minecraft
            }
        });
    }
}
