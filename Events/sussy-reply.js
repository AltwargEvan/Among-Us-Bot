const { createAudioPlayer, joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');

async function ConnectToChannel(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Don't interact with other bots
        if (message.author.bot) return;
        if (!message.guild) return;

        const channel = message.member.voice.channel

        // Check if message contains a trigger word
        let sussyVocabulary = ["sus", 'among us']
        sussyVocabulary.forEach(async word => {
            if (message.content.includes(word)) {
                // If user isn't in voice, reply with text
                if (!channel) return await message.reply('Among 😃👿 us 🇺🇸 in 🏽 real 🔎 life 👊🧬 (sus, sus) Among 💰 us 💰👨👨 in 🏽👏 real 👹 life 💓 (sus, sus) Playing ❣️ among 💰 us 🇺🇸👨 in 👉 real 📷 life 🧬 Spaceship with my ✋🏻😀🕒 crew 👬 Gonna 🙃👈👈 split 🕺🏻 up, 😿 spread ✨ out 😝🚪 \'Cause 🐗 we 👬 all 😋💩 got 👍 tasks 🙌🤗 to do 😤 Gotta 🙈 find 🔍🔍 the imposter 🚫 As they 🤼 try 😈 to sabotage Who 🤷 can 🤦‍♂️ we 👩‍👩‍👦‍👦 trust 🫂 in 😩😂 this among 🙆🏽 us 🇺🇸 entourage ? Heard 👂🏻 a sound, 🎤 turned 😍 around 💞 Looking 👀 up, 🚘 looking 👀 down ⬇️ Then 🏿 I 🤢 find 🔎 a dead 🐩 body 💃 Gotta 👉 blow 🌬 the horn 📯 emergency 🚨 Discussion 🤔 who 👿 should 💘🤔 we 👩‍👩‍👦‍👦 believe 🙏 Can\'t 👄 decide 😱😱 so now 👇 we 👥 leave 🦋🥰 Not ❌ sure 😉🔜 what 🤪🤪 I\'m 😏 about 💥 to see 👀👀 Will 🔥 it be 👏 a dead 😳 body ? 💃 Still 🥇 have 🙋🍡🎣 a task I 🙀 must 👫 complete 🚫 Who\'s ☑️ the impostеr ? Looking 👀 sus, who ❓ can 👺 we 👦💰 trust ? 🤞 Who\'s 🤷 the imposter ? 😡😤 Looking 👀 sus, who 👀 can wе 🧚 trust ? 🫂 Who\'s 🤷 the imposter ? 🚫 Looking 👀 sus, who 🤷 can 🥫 we 👨👩 trust ? 🤞 Who\'s 😇 the imposter ? 😡😤 Looking 😏💕 sus, who 😂🤷 can we 👧 trust ? 🤞 I\'m 🤪 a ghost, 👻 I\'m 😓 my 🧜🏻‍♀️ biggest 🙀 fear 😨 Got killed… ⚰️')
                // Join voice and play song for 5 seconds
                else {
                    try {
                        const player = createAudioPlayer();
                        const connection = await ConnectToChannel(channel)
                        connection.subscribe(player)
                        console.log('playing now')
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        })
    },
};