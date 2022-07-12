module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity('Stein\'s Gate', { type: 'WATCHING' });
        client.user.setStatus('online');
    },
};