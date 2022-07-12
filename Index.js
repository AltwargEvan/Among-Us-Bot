const { Client, VoiceChannel, Intents } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
require('dotenv').config()

const token = process.env.SECRET_TOKEN

/**
 * 	In this example, we are creating a single audio player that plays to a number of voice channels.
 * The audio player will play a single track.
 */

/**
 * Create the audio player. We will use this for all of our connections.
 */
const player = createAudioPlayer();
function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}
function playSong() {
    /**
     * Here we are creating an audio resource using a sample song freely available online
     * (see https://www.soundhelix.com/audio-examples)
     *
     * We specify an arbitrary inputType. This means that we aren't too sure what the format of
     * the input is, and that we'd like to have this converted into a format we can use. If we
     * were using an Ogg or WebM source, then we could change this value. However, for now we
     * will leave this as arbitrary.
     */
    const resource = createAudioResource('./Resources/AmongUsInRealLife.mp3', {
        inputType: StreamType.Arbitrary,
    });

    /**
     * We will now play this to the audio player. By default, the audio player will not play until
     * at least one voice connection is subscribed to it, so it is fine to attach our resource to the
     * audio player this early.
     */
    player.play(resource);

    /**
     * Here we are using a helper function. It will resolve if the player enters the Playing
     * state within 5 seconds, otherwise it will reject with an error.
     */
    return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

async function connectToChannel(channel) {
    /**
     * Here, we try to establish a connection to a voice channel. If we're already connected
     * to this voice channel, @discordjs/voice will just return the existing connection for us!
     */
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    /**
     * If we're dealing with a connection that isn't yet Ready, we can set a reasonable
     * time limit before giving up. In this example, we give the voice connection 30 seconds
     * to enter the ready state before giving up.
     */
    try {
        /**
         * Allow ourselves 10 seconds to join the voice channel. If we do not join within then,
         * an error is thrown.
         */
        await entersState(connection, VoiceConnectionStatus.Ready, 10e3);
        /**
         * At this point, the voice connection is ready within 10 seconds! This means we can
         * start playing audio in the voice channel. We return the connection so it can be
         * used by the caller.
         */
        return connection;
    } catch (error) {
        /**
         * At this point, the voice connection has not entered the Ready state. We should make
         * sure to destroy it, and propagate the error by throwing it, so that the calling function
         * is aware that we failed to connect to the channel.
         */
        connection.destroy();
        throw error;
    }
}

/**
 * Main code
 * =========
 * Here we will implement the helper functions that we have defined above.
 */

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

void client.login(token);

client.on('ready', async () => {
    console.log('Discord.js client is ready!');

    /**
     * Try to get our song ready to play for when the bot joins a voice channel
     */
    try {
        await playSong();
    } catch (error) {
        /**
         * The song isn't ready to play for some reason :(
         */
        console.error(error);
    }
});

client.on('messageCreate', async (message) => {
    if (!message.guild) return;
    const sussyVocabulary = ['sus', 'among us']
    if (sussyVocabulary.includes(message.content.toLowerCase())) {
        const channel = message.member?.voice.channel;
        message.reply('Among 😃👿 us 🇺🇸 in 🏽 real 🔎 life 👊🧬 (sus, sus) Among 💰 us 💰👨👨 in 🏽👏 real 👹 life 💓 (sus, sus) Playing ❣️ among 💰 us 🇺🇸👨 in 👉 real 📷 life 🧬 Spaceship with my ✋🏻😀🕒 crew 👬 Gonna 🙃👈👈 split 🕺🏻 up, 😿 spread ✨ out 😝🚪 \'Cause 🐗 we 👬 all 😋💩 got 👍 tasks 🙌🤗 to do 😤 Gotta 🙈 find 🔍🔍 the imposter 🚫 As they 🤼 try 😈 to sabotage Who 🤷 can 🤦‍♂️ we 👩‍👩‍👦‍👦 trust 🫂 in 😩😂 this among 🙆🏽 us 🇺🇸 entourage ? Heard 👂🏻 a sound, 🎤 turned 😍 around 💞 Looking 👀 up, 🚘 looking 👀 down ⬇️ Then 🏿 I 🤢 find 🔎 a dead 🐩 body 💃 Gotta 👉 blow 🌬 the horn 📯 emergency 🚨 Discussion 🤔 who 👿 should 💘🤔 we 👩‍👩‍👦‍👦 believe 🙏 Can\'t 👄 decide 😱😱 so now 👇 we 👥 leave 🦋🥰 Not ❌ sure 😉🔜 what 🤪🤪 I\'m 😏 about 💥 to see 👀👀 Will 🔥 it be 👏 a dead 😳 body ? 💃 Still 🥇 have 🙋🍡🎣 a task I 🙀 must 👫 complete 🚫 Who\'s ☑️ the impostеr ? Looking 👀 sus, who ❓ can 👺 we 👦💰 trust ? 🤞 Who\'s 🤷 the imposter ? 😡😤 Looking 👀 sus, who 👀 can wе 🧚 trust ? 🫂 Who\'s 🤷 the imposter ? 🚫 Looking 👀 sus, who 🤷 can 🥫 we 👨👩 trust ? 🤞 Who\'s 😇 the imposter ? 😡😤 Looking 😏💕 sus, who 😂🤷 can we 👧 trust ? 🤞 I\'m 🤪 a ghost, 👻 I\'m 😓 my 🧜🏻‍♀️ biggest 🙀 fear 😨 Got killed… ⚰️')
        if (channel) {
            /**
             * The user is in a voice channel, try to connect.
             */
            try {
                const connection = await connectToChannel(channel);
                /**
                 * We have successfully connected! Now we can subscribe our connection to
                 * the player. This means that the player will play audio in the user's
                 * voice channel.
                 */
                connection.subscribe(player);
                await delay(5)
                connection.destroy()
                playSong()
            } catch (error) {
                /**
                 * Unable to connect to the voice channel within 30 seconds :(
                 */
                console.error(error);
            }
        }
    }
});
