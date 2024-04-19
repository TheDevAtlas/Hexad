package net.thedevatlas.hexad;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.entities.channel.unions.MessageChannelUnion;
import net.dv8tion.jda.api.entities.emoji.Emoji;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.minecraft.client.MinecraftClient;
import net.minecraft.text.Text;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import java.awt.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.EnumSet;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.interactions.components.buttons.Button;

public class DiscordBot extends ListenerAdapter{
    public static final Emoji HEART = Emoji.fromUnicode("U+2764");
    private String status = "I Am Not Currently Doing Anything.";
    public static JDA jda;

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
    public static void RunBot() throws IOException
    {
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
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("I have awaken, father").queue();
            jda.awaitReady();
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Logged into: " + username).queue();


            EmbedBuilder embed = new EmbedBuilder();
            embed.setTitle(botName + "'s Control Panel");
            //embed.setThumbnail("Apollo.png");
            embed.setColor(0x42b580);
            embed.setDescription("Here's My Available Commands");
            embed.addField("Stop", "Stops The Current Task", true);
            embed.addField("Status","Returns The Bots Status",true);

            Button button = Button.success("Stop", "Stop");
            Button button2 = Button.danger("Status", "Status");
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("").setEmbeds(embed.build()).setActionRow(button, button2).queue();
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }

    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event)
    {
        User author = event.getAuthor();
        MessageChannelUnion channel = event.getChannel();
        Message message = event.getMessage();
        if (event.isFromGuild())
        {
            System.out.printf("[%s] [%#s] %#s: %s\n",
                    event.getGuild().getName(),
                    channel,
                    author,
                    message.getContentDisplay()
            );

            if(author.getName().equals("thedevatlas") || author.getName().equals("swig4"))
            {
                System.out.println(author.getName() + " : Can Run Commands");
                // bot.getSelfUser().getGuildById(...).getTextChannelById(...).sendMessage(...).queue()
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
                                    embed.setColor(new Color(255,0,0));

                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Mine " + blockName).setEmbeds(embed.build()).queue();
                                    ClientPlayConnectionEvents.JOIN.register((handler, sender, client) -> {
                                        if(client.player != null) {
                                            handler.sendChatMessage("#mine " + blockName);
                                        }
                                    });
                                } else {
                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Missing block name. Please specify a block to mine.");
                                }
                                break;
                            case "status":
                                String username = MinecraftClient.getInstance().getSession().getUsername();
                                String runtime = getRuntime();
                                String statusWithRuntime = status + "\nRuntime: " + runtime + "\nCurrent Account: " + username;
                                EmbedBuilder embedstatus = new EmbedBuilder();
                                embedstatus.setTitle("Current Status");
                                embedstatus.setDescription(statusWithRuntime);
                                embedstatus.setColor(new Color(255,0,0));

                                //.getChannel().sendMessage("Mine!").setEmbeds(embed.build()).queue()
                                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Status").setEmbeds(embedstatus.build()).queue();
                                break;
                            case "stop":
                                jda.getPresence().setActivity(Activity.customStatus("Ready and Willing"));
                                EmbedBuilder embedstop = new EmbedBuilder();
                                embedstop.setTitle("Stop");
                                embedstop.setDescription("I Have Stopped My Current Task");
                                embedstop.setColor(new Color(255,0,0));

                                //.getChannel().sendMessage("Mine!").setEmbeds(embed.build()).queue()
                                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Stop").setEmbeds(embedstop.build()).queue();
                                status = "I Am Not Currently Doing Anything.";
                                ClientPlayConnectionEvents.JOIN.register((handler, sender, client) -> {
                                    if(client.player != null) {
                                        handler.sendChatMessage("#cancel");
                                    }
                                });
                                break;
                        }
                    }
                }
            }
            else if(!author.isBot())
            {
                System.out.println(author.getName() + " : Can Not Run Commands");
                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("you are not father").queue();
            }
        }
        else
        {
            System.out.printf("[direct] %#s: %s\n",
                    author,
                    message.getContentDisplay()
            );
        }
        if (channel.getType() == ChannelType.TEXT)
        {
            System.out.println("The channel topic is " + channel.asTextChannel().getTopic());
        }

        if (channel.getType().isThread())
        {
            System.out.println("This thread is part of channel #" +
                    channel.asThreadChannel()
                            .getParentChannel()
                            .getName()
            );
        }
    }

    @Override
    public void onMessageReactionAdd(MessageReactionAddEvent event)
    {
        if (event.getEmoji().equals(HEART))
            System.out.println("A user loved a message!");
    }
    @SubscribeEvent
    public void onButtonClick(ButtonInteractionEvent event) {
        String buttonId = event.getComponentId();
        if (buttonId.equals("Stop")) {
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Stop Clicked").queue();
        } else if (buttonId.equals("Status")) {
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Status Clicked").queue();
        }
    }
}

