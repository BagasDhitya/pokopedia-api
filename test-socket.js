const { io } = require('socket.io-client');

// Connect to your Socket.IO server
const socket = io('http://localhost:8000');

socket.on('connect', () => {
    console.log('✅ Connected! Socket ID:', socket.id);

    // Test 1: Join a room
    console.log('🏠 Joining room 2...');
    socket.emit('joinRoom', 2);

    // Test 2: Send a message after 1 second
    setTimeout(() => {
        console.log('💬 Sending message...');
        socket.emit('sendMessage', {
            content: 'Hello from Node.js client!',
            senderId: 1,
            receiverId: 2,
            transactionId: 2
        });
    }, 1000);
});

socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
});

socket.on('newMessage', (message) => {
    console.log('📨 New message received:', message);
});

socket.on('messageSent', (data) => {
    console.log('✅ Message sent confirmation:', data);
});

socket.on('messageError', (error) => {
    console.log('❌ Message error:', error);
});

// Keep the script running
console.log('🔄 Connecting to Socket.IO server...');

// Exit after 10 seconds
setTimeout(() => {
    console.log('👋 Disconnecting...');
    socket.disconnect();
    process.exit(0);
}, 10000);