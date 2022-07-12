function PlaySong(player) {
    const resource = createAudioResource(('../Resources/AmongUsInRealLife.mp3'), {
        inputType: StreamType.Arbitrary,
    });

    player.play(resource);

    return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        await PlaySong()
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity('Stein\'s Gate', { type: 'WATCHING' });
        client.user.setStatus('online');

    },
};