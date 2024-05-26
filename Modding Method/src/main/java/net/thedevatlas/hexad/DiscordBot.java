package net.thedevatlas.hexad;

import baritone.api.BaritoneAPI;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import net.dv8tion.jda.api.entities.channel.unions.MessageChannelUnion;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.minecraft.block.Blocks;
import net.minecraft.client.RunArgs;
import net.minecraft.client.network.ClientConnectionState;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.minecraft.client.MinecraftClient;
import net.minecraft.text.Text;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import java.awt.*;
import java.io.IOException;
import java.util.List;
import java.util.EnumSet;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import net.dv8tion.jda.api.Permission;
import java.util.stream.Collectors;

import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.interactions.components.buttons.Button;

// need to control multiple clients from one discord bot //

public class DiscordBot extends ListenerAdapter {

    private String status = "I Am Not Currently Doing Anything.";
    public static JDA jda;

    private static LocalDateTime startTime;
    private int statusNumber = 0;
    //MinecraftClient mc = MinecraftClient.getInstance();

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

        try
        {
            jda = JDABuilder.createLight(token, intents)
                    .addEventListeners(new DiscordBot())
                    .setActivity(Activity.customStatus("Ready and Willing"))
                    .build();
            jda.getRestPing().queue(ping ->
                    System.out.println("Logged in with ping: " + ping)
            );

            jda.awaitReady();
            String botName = jda.getSelfUser().getName();
            //System.out.println("Guilds: " + jda.getGuildCache().size());
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
            Button button3 = Button.success("Help", "Help");
            channel.sendMessageEmbeds(embed.build()).setActionRow(button, button2, button3).queue();
            /*ClientPlayConnectionEvents.JOIN.register((h, sender, c) -> {
                if (client.player != null) {
                    //handler.sendChatMessage("#mine " + blockName);
                    client = c;
                }
            });*/
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
                                    statusNumber = 1;
                                    EmbedBuilder embed = new EmbedBuilder();
                                    embed.setTitle("Mining");
                                    embed.setDescription("I yearn for the mines of " + blockName);
                                    embed.setColor(0x42b580);
                                    embed.setFooter("Made By: thedevatlas And swig4");
                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embed.build()).queue();
                                    //handler = new ClientPlayNetworkHandler(new MinecraftClient(new RunArgs()), new ClientConnection(), new ClientConnectionState());
                                    //client.player.sendMessage(Text.literal("#mine " + blockName), false);

                                    ////////////
                                    BaritoneAPI.getProvider().getPrimaryBaritone().getMineProcess().mineByName(blockName);
                                    ////////////
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
                                String text = "";
                                int color = 0x42b580;
                                jda.getPresence().setActivity(Activity.customStatus("Ready and Willing"));
                                status = "I Am Not Currently Doing Anything.";
                                if (statusNumber == 1) {
                                    BaritoneAPI.getProvider().getPrimaryBaritone().getMineProcess().cancel();
                                    text = "I Have Stopped My Current Task";
                                } else if (statusNumber == 2) {
                                    //for other cmds
                                } else {
                                    text = "I Am Not Doing Anything";
                                    color = 0xFF0000;
                                }
                                EmbedBuilder embedstop = new EmbedBuilder();
                                embedstop.setTitle("Stop");
                                embedstop.setDescription(text);
                                embedstop.setColor(color);
                                embedstop.setFooter("Made By: thedevatlas And swig4");
                                //.getChannel().sendMessage("Mine!").setEmbeds(embed.build()).queue()
                                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embedstop.build()).queue();
                                statusNumber = 0;
                                break;
                            case "goto":
                                if (parts.length >= 5) {
                                    int x = Integer.parseInt(parts[2]);
                                    int y = Integer.parseInt(parts[3]);
                                    int z = Integer.parseInt(parts[4]);
                                    jda.getPresence().setActivity(Activity.customStatus("Walking To  (" + x + ", " + y + ", " + z + ")"));
                                    status = "I Am Currently Walking To: (" + x + ", " + y + ", " + z + ")";
                                    EmbedBuilder embed = new EmbedBuilder();
                                    embed.setTitle("Walking To");
                                    embed.setDescription("Walking To (" + x + ", " + y + ", " + z + ")");
                                    embed.setColor(0x42b580);
                                    embed.setFooter("Made By: thedevatlas And swig4");
                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embed.build()).queue();
                                    //handler = new ClientPlayNetworkHandler(new MinecraftClient(new RunArgs()), new ClientConnection(), new ClientConnectionState());
                                    //client.player.sendMessage(Text.literal("#mine " + blockName), false);

                                    ////////////
                                    //BaritoneAPI.getProvider().getPrimaryBaritone().
                                    ////////////
                                } else {
                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Missing coordinates. Please specify X Y Z coordinates to walk to.").queue();
                                }
                                break;
                        }
                    }
                }
            } else if (!author.isBot()) {
                //System.out.println(author.getName() + " : Can Not Run Commands");
                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("you are not father").queue();
            }

            if (channel.getType() == ChannelType.TEXT) {
                System.out.println("The channel topic is " + channel.asTextChannel().getTopic());
            }
        } else {
            //System.out.printf("[direct] %#s: %s\n",
            //        author,
            //        message.getContentDisplay()
            //);
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
                stop(event);
                break;
            case "Status":
                status(event);
                break;
            case "Help":
                EmbedBuilder embed = new EmbedBuilder();
                embed.setTitle("Help");
                embed.setDescription("Put The Bot Name In Front Of The Command.\nmine | status | stop");
                embed.setColor(0x42b580);
                embed.setFooter("Made By: thedevatlas And swig4");
                event.replyEmbeds(embed.build()).setEphemeral(true).queue();
            default:
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
        String text = "";
        int color = 0x42b580;
        if (statusNumber == 1) {
            BaritoneAPI.getProvider().getPrimaryBaritone().getMineProcess().cancel();
            text = "I Have Stopped My Current Task";
        } else if (statusNumber == 2) {
            //for other cmds
        } else {
            text = "I Am Not Doing Anything";
            color = 0xFF0000;
        }
        EmbedBuilder embed = new EmbedBuilder();
        embed.setTitle("Stop");
        embed.setDescription(text);
        embed.setColor(color);
        embed.setFooter("Made By: thedevatlas And swig4");
        event.replyEmbeds(embed.build()).setEphemeral(true).queue();
        status = "I Am Not Currently Doing Anything.";
        statusNumber = 0;
    }

}