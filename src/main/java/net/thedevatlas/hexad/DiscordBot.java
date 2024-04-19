package net.thedevatlas.hexad;

import baritone.api.BaritoneAPI;
import baritone.api.pathing.goals.GoalBlock;
import baritone.api.pathing.goals.GoalGetToBlock;

import baritone.api.process.IMineProcess;
import baritone.api.utils.BlockOptionalMeta;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.entities.channel.unions.MessageChannelUnion;
import net.dv8tion.jda.api.entities.emoji.Emoji;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.minecraft.block.Blocks;
import net.minecraft.client.RunArgs;
import net.minecraft.client.network.ClientConnectionState;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.network.ClientPlayNetworkHandler;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.network.ClientConnection;
import net.minecraft.text.Text;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import java.awt.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.EnumSet;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.interactions.components.buttons.Button;

public class DiscordBot extends ListenerAdapter {
    public static final Emoji HEART = Emoji.fromUnicode("U+2764");
    private String status = "I Am Not Currently Doing Anything.";
    public static JDA jda;
    public static MinecraftClient client;
    private static LocalDateTime startTime;
    MinecraftClient mc = MinecraftClient.getInstance();

    public static String getRuntime() {
        LocalDateTime currentTime = LocalDateTime.now();
        long seconds = java.time.Duration.between(startTime, currentTime).getSeconds();
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        seconds = seconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    public static void RunBot() throws IOException {
        startTime = LocalDateTime.now();
        String token = "MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gm3K6_.8BOr2edNcooPGV1gTlyiiGO4LaMUEmc9MbtKmU";
        EnumSet<GatewayIntent> intents = EnumSet.of(
                GatewayIntent.GUILD_MESSAGES,
                GatewayIntent.DIRECT_MESSAGES,
                GatewayIntent.MESSAGE_CONTENT,
                GatewayIntent.GUILD_MESSAGE_REACTIONS,
                GatewayIntent.DIRECT_MESSAGE_REACTIONS
        );

        try {
            jda = JDABuilder.createLight(token, intents)
                    .addEventListeners(new DiscordBot())
                    .setActivity(Activity.customStatus("Ready and Willing"))
                    .build();
            //jda.getRestPing().queue(ping ->
            //        System.out.println("Logged in with ping: " + ping)
            //);

            jda.awaitReady();
            String botName = jda.getSelfUser().getName();
            String username = MinecraftClient.getInstance().getSession().getUsername();
            String combinedMessage = "I have awaken, father\nLogged into: " + username;
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage(combinedMessage).queue();
            String channelId = "1229958021489102899";
            TextChannel channel = jda.getGuildById("1229946274908864543").getTextChannelById(channelId);
            List<Message> botMessages = channel.getIterableHistory().complete().stream()
                    .filter(message -> message.getAuthor().getId().equals(jda.getSelfUser().getId()))
                    .collect(Collectors.toList());
            for (Message botMessage : botMessages) {
                botMessage.delete().queue();
            }
            EmbedBuilder embed = new EmbedBuilder();
            embed.setTitle(botName + "'s Control Panel");
            embed.setColor(0x42b580);
            embed.setDescription("Here's My Available Commands");
            embed.addField("Stop", "Stops The Current Task", true);
            embed.addField("Status", "Returns The Bots Status", true);
            embed.setFooter("Made By: thedevatlas And swig4");
            Button button = Button.success("Stop", "Stop");
            Button button2 = Button.success("Status", "Status");
            channel.sendMessageEmbeds(embed.build()).setActionRow(button, button2).queue();
            ClientPlayConnectionEvents.JOIN.register((h, sender, c) -> {
                if (client.player != null) {
                    //handler.sendChatMessage("#mine " + blockName);
                    client = c;
                }
            });
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        User author = event.getAuthor();
        MessageChannelUnion channel = event.getChannel();
        Message message = event.getMessage();
        if (event.isFromGuild()) {
            //System.out.printf("[%s] [%#s] %#s: %s\n",
            //        event.getGuild().getName(),
            //        channel,
            //        author,
            //        message.getContentDisplay()
            //);

            if (author.getName().equals("thedevatlas") || author.getName().equals("swig4")) {
                // System.out.println(author.getName() + " : Can Run Commands");
                String[] parts = message.getContentDisplay().split(" ");
                if (event.isFromGuild()) {
                    String botName = jda.getSelfUser().getName();
                    if (parts.length >= 2 && parts[0].equalsIgnoreCase(botName)) {
                        String command = parts[1].toLowerCase();
                        switch (command) {
                            case "mine":
                                if (parts.length >= 3) {
                                    String blockName = parts[2].toLowerCase();
                                    jda.getPresence().setActivity(Activity.customStatus("Mining " + blockName));
                                    status = "I Am Currently Mining " + blockName;
                                    EmbedBuilder embed = new EmbedBuilder();
                                    embed.setTitle("Mining");
                                    embed.setDescription("I yearn for the mines of " + blockName);
                                    embed.setColor(0x42b580);
                                    embed.setFooter("Made By: thedevatlas And swig4");
                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embed.build()).queue();
                                    //handler = new ClientPlayNetworkHandler(new MinecraftClient(new RunArgs()), new ClientConnection(), new ClientConnectionState());
                                    client.player.sendMessage(Text.literal("#mine " + blockName), false);

                                    BaritoneAPI.getProvider().getPrimaryBaritone().getMineProcess().mineByName(blockName);
                                } else {
                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Missing block name. Please specify a block to mine.").queue();
                                }
                                break;
                            case "status":
                                String username = MinecraftClient.getInstance().getSession().getUsername();
                                String runtime = getRuntime();
                                String statusWithRuntime = status + "\nRuntime: " + runtime + "\nCurrent Account: " + username;
                                EmbedBuilder embedstatus = new EmbedBuilder();
                                embedstatus.setTitle("Current Status");
                                embedstatus.setDescription(statusWithRuntime);
                                embedstatus.setColor(0x42b580);
                                embedstatus.setFooter("Made By: thedevatlas And swig4");
                                //.getChannel().sendMessage("Mine!").setEmbeds(embed.build()).queue()
                                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embedstatus.build()).queue();
                                break;
                            case "stop":
                                jda.getPresence().setActivity(Activity.customStatus("Ready and Willing"));
                                EmbedBuilder embedstop = new EmbedBuilder();
                                embedstop.setTitle("Stop");
                                embedstop.setDescription("I Have Stopped My Current Task");
                                embedstop.setColor(0x42b580);
                                embedstop.setFooter("Made By: thedevatlas And swig4");
                                //.getChannel().sendMessage("Mine!").setEmbeds(embed.build()).queue()
                                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embedstop.build()).queue();
                                status = "I Am Not Currently Doing Anything.";
                                /*ClientPlayConnectionEvents.JOIN.register((handler, sender, client) -> {
                                    if(client.player != null) {
                                        handler.sendChatMessage("#cancel");
                                    }
                                });*/
                                client.player.sendMessage(Text.literal("#stop"), false);
                                break;
                        }
                    }
                }
            } else if (!author.isBot()) {
                //System.out.println(author.getName() + " : Can Not Run Commands");
                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("you are not father").queue();
            }
        } else {
            //System.out.printf("[direct] %#s: %s\n",
            //        author,
            //        message.getContentDisplay()
            //);
        }
        if (channel.getType() == ChannelType.TEXT) {
            System.out.println("The channel topic is " + channel.asTextChannel().getTopic());
        }

        if (channel.getType().isThread()) {
            //System.out.println("This thread is part of channel #" +
            //        channel.asThreadChannel()
            //                .getParentChannel()
            //                .getName()
            //);
        }
    }

    @Override
    public void onButtonInteraction(ButtonInteractionEvent event) {
        String buttonId = event.getComponentId();
        switch (buttonId) {
            case "Stop":
                stop(event); // Pass the event to the stop method
                break;
            case "Status":
                status(event); // Pass the event to the status method
                break;
            default:
                // Handle unknown button clicks
                event.reply("Unknown button clicked!").queue();
        }
    }

    public void status(ButtonInteractionEvent event) {
        String username = MinecraftClient.getInstance().getSession().getUsername();
        String runtime = getRuntime();
        String statusWithRuntime = status + "\nRuntime: " + runtime + "\nCurrent Account: " + username;

        EmbedBuilder embed = new EmbedBuilder();
        embed.setTitle("Current Status");
        embed.setDescription(statusWithRuntime);
        embed.setColor(Color.GREEN);
        embed.setFooter("Made By: thedevatlas And swig4");

        event.replyEmbeds(embed.build()).setEphemeral(true).queue();
    }

    public void stop(ButtonInteractionEvent event) {
        EmbedBuilder embed = new EmbedBuilder();
        embed.setTitle("Stop");
        embed.setDescription("I Have Stopped My Current Task");
        embed.setColor(Color.RED);
        embed.setFooter("Made By: thedevatlas And swig4");

        event.replyEmbeds(embed.build()).setEphemeral(true).queue();

        status = "I Am Not Currently Doing Anything.";
        client.player.sendMessage(Text.literal("#stop"), false);
    }
}

