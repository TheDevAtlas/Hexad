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
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.minecraft.client.MinecraftClient;
import net.minecraft.text.Text;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

//import javax.annotation.Nonnull;
import java.awt.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.EnumSet;

public class DiscordBot extends ListenerAdapter{
    // See https://emojipedia.org/red-heart/ and find the codepoints
    public static final Emoji HEART = Emoji.fromUnicode("U+2764");
    private String status = "I Am Not Currently Doing Anything.";
    public static JDA jda;
    static String username = MinecraftClient.getInstance().getSession().getUsername();
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


        // Possible ways to provide the token:

        // 1. From a file:

        // This would just be some text file with only the token in it
        // Use Files.readString in java 11+
        String token = "MTIyOTk0ODY0NDc5MTE2MDg5Mg.Gm3K6_.8BOr2edNcooPGV1gTlyiiGO4LaMUEmc9MbtKmU";

        // 2. Using environment variable:
        // String token = System.getenv("TOKEN");

        // 3. Using system property as -Dtoken=...
        // This leaks the token in command line (task manager) and thread dumps to any other users on the same machine
        // String token = System.getProperty("token");

        // 4. From the command line directly
        // This leaks the token in command line (task manager) to any other users on the same machine
        // String token = args[0];


        // Pick which intents we need to use in our code.
        // To get the best performance, you want to make the most minimalistic list of intents, and have all others disabled.
        // When an intent is enabled, you will receive events and cache updates related to that intent.
        // For more information:
        //
        // - The documentation for GatewayIntent: https://docs.jda.wiki/net/dv8tion/jda/api/requests/GatewayIntent.html
        // - The wiki page for intents and caching: https://jda.wiki/using-jda/gateway-intents-and-member-cache-policy/

        EnumSet<GatewayIntent> intents = EnumSet.of(
                // Enables MessageReceivedEvent for guild (also known as servers)
                GatewayIntent.GUILD_MESSAGES,
                // Enables the event for private channels (also known as direct messages)
                GatewayIntent.DIRECT_MESSAGES,
                // Enables access to message.getContentRaw()
                GatewayIntent.MESSAGE_CONTENT,
                // Enables MessageReactionAddEvent for guild
                GatewayIntent.GUILD_MESSAGE_REACTIONS,
                // Enables MessageReactionAddEvent for private channels
                GatewayIntent.DIRECT_MESSAGE_REACTIONS
        );

        // To start the bot, you have to use the JDABuilder.

        // You can choose one of the factory methods to build your bot:
        // - createLight(...)
        // - createDefault(...)
        // - create(...)
        // Each of these factory methods use different defaults, you can check the documentation for more details.

        try
        {
            // By using createLight(token, intents), we use a minimalistic cache profile (lower ram usage)
            // and only enable the provided set of intents. All other intents are disabled, so you won't receive events for those.
            jda = JDABuilder.createLight(token, intents)
                    // On this builder, you are adding all your event listeners and session configuration
                    .addEventListeners(new DiscordBot())
                    // You can do lots of configuration before starting, checkout all the setters on the JDABuilder class!
                    .setActivity(Activity.customStatus("Ready and Willing"))
                    // Once you're done configuring your jda instance, call build to start and login the bot.
                    .build();

            // Here you can now start using the jda instance before its fully loaded,
            // this can be useful for stuff like creating background services or similar.

            // The queue(...) means that we are making a REST request to the discord API server!
            // Usually, this is done asynchronously on another thread which handles scheduling and rate-limits.
            // The (ping -> ...) is called a lambda expression, if you're unfamiliar with this syntax it is HIGHLY recommended to look it up!
            jda.getRestPing().queue(ping ->
                    // shows ping in milliseconds
                    System.out.println("Logged in with ping: " + ping)
            );

            // If you want to access the cache, you can use awaitReady() to block the main thread until the jda instance is fully loaded
            jda.awaitReady();

            // Now we can access the fully loaded cache and show some statistics or do other cache dependent things
            System.out.println("Guilds: " + jda.getGuildCache().size());

            // bot.getSelfUser().getGuildById(...).getTextChannelById(...).sendMessage(...).queue()
            // jda.getSelfUser().getMutualGuilds().getFirst().getTextChannelById(0).sendMessage("I have awaken, father").queue();
            //jda.getSelfUser().getMutualGuilds().get(0).getTextChannelById(0).sendMessage("I have awaken, father").queue();
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("I have awaken, father").queue();
            jda.awaitReady();
            jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Logged into: " + username).queue();
        }
        catch (InterruptedException e)
        {
            // Thrown if the awaitReady() call is interrupted
            e.printStackTrace();
        }
    }

    // This overrides the method called onMessageReceived in the ListenerAdapter class
    // Your IDE (such as intellij or eclipse) can automatically generate this override for you, by simply typing "onMessage" and auto-completing it!
    @Override
    public void onMessageReceived(MessageReceivedEvent event)
    {
        // The user who sent the message
        User author = event.getAuthor();
        // This is a special class called a "union", which allows you to perform specialization to more concrete types such as TextChannel or NewsChannel
        MessageChannelUnion channel = event.getChannel();
        // The actual message sent by the user, this can also be a message the bot sent itself, since you *do* receive your own messages after all
        Message message = event.getMessage();

        // Check whether the message was sent in a guild / server
        if (event.isFromGuild())
        {

            // This is a message from a server
            System.out.printf("[%s] [%#s] %#s: %s\n",
                    event.getGuild().getName(), // The name of the server the user sent the message in, this is generally referred to as "guild" in the API
                    channel, // The %#s makes use of the channel name and displays as something like #general
                    author,  // The %#s makes use of User#getAsTag which results in something like minn or Minn#1337
                    message.getContentDisplay() // This removes any unwanted mention syntax and converts it to a readable string
            );

            if(author.getName().equals("thedevatlas") || author.getName().equals("swig4"))
            {
                System.out.println(author.getName() + " : Can Run Commands");

                // Send Back A Response To User //
                // bot.getSelfUser().getGuildById(...).getTextChannelById(...).sendMessage(...).queue()
                String[] parts = message.getContentDisplay().split(" ");

                // Check if the message was sent in a guild/server
                if (event.isFromGuild()) {
                    // Extract the bot's name from the JDA instance
                    String botName = jda.getSelfUser().getName();
                    if (parts.length >= 2 && parts[0].equalsIgnoreCase(botName)) {
                        String command = parts[1].toLowerCase(); // Extract the command
                        switch (command) {
                            case "mine":
                                // Check if the command has the block name
                                if (parts.length >= 3) {
                                    // Extract the block name from the command
                                    String blockName = parts[2].toLowerCase(); // Assuming the block name is the third part of the command
                                    // Set the activity to mining the specified block
                                    jda.getPresence().setActivity(Activity.customStatus("Mining " + blockName));
                                    status = "I Am Currently Mining " + blockName;

                                    // Send Message //
                                    EmbedBuilder embed = new EmbedBuilder();
                                    embed.setTitle("Mining");
                                    embed.setDescription("I yearn for the mines of " + blockName);
                                    embed.setColor(new Color(255,0,0));

                                    jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Mine " + blockName).setEmbeds(embed.build()).queue();
                                    mc.player.sendMessage(Text.of("#mine " + blockName));
                                } else {
                                    // If the block name is missing, reply with a message indicating that
                                    message.reply("Missing block name. Please specify a block to mine.");
                                }
                                break;
                            case "status":
                                String runtime = getRuntime();
                                String statusWithRuntime = status + "\nRuntime: " + runtime;
                                // Send Message //
                                EmbedBuilder embedstatus = new EmbedBuilder();
                                embedstatus.setTitle("Current Status");
                                embedstatus.setDescription(statusWithRuntime);
                                embedstatus.setColor(new Color(255,0,0));

                                //.getChannel().sendMessage("Mine!").setEmbeds(embed.build()).queue()
                                jda.getGuildById("1229946274908864543").getTextChannelById("1229946274908864546").sendMessage("Status").setEmbeds(embedstatus.build()).queue();
                                break;
                            case "stop":
                                message.reply("I Have Stopped My Current Task.");
                                status = "I Am Not Currently Doing Anything.";
                                mc.player.sendMessage(Text.of("#cancel"));
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
            // This is a message from a private channel
            System.out.printf("[direct] %#s: %s\n",
                    author, // same as above
                    message.getContentDisplay()
            );
        }

        // Using specialization, you can check concrete types of the channel union

        if (channel.getType() == ChannelType.TEXT)
        {
            System.out.println("The channel topic is " + channel.asTextChannel().getTopic());
        }

        if (channel.getType().isThread())
        {
            System.out.println("This thread is part of channel #" +
                    channel.asThreadChannel()  // Cast the channel union to thread
                            .getParentChannel() // Get the parent of that thread, which is the channel it was created in (like forum or text channel)
                            .getName()          // And then print out the name of that channel
            );
        }
    }

    @Override
    public void onMessageReactionAdd(MessageReactionAddEvent event)
    {
        if (event.getEmoji().equals(HEART))
            System.out.println("A user loved a message!");
    }
}
