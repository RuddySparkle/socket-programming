const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const app = express();
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const connectDB = require('./database/mongo');
require('dotenv').config({ path: '.env.local' });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Connect to MongoDB
connectDB();

const server = app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

const botName = 'TwT Bot';

global.onlineUsers = new Map();
io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', formatMessage(data.username, data.msg));
        }
    });

    socket.on('join-room', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        console.log(user);

        socket.join(user.room);
        console.log(`${user.username} has joined Room ${room} with ID ${socket.id}`);
        // Welcome current user
        socket.emit('msg-receive', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('msg-receive', formatMessage(botName, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Group Chat Messages
    socket.on('send-group-message', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log('Sender user info,', user);
        console.log('Send Group Message, ', msg);
        console.log('Send to room,', user.room);
        console.log('User in the room,', getRoomUsers(user.room));
        const users = getRoomUsers(user.room);
        for (let i = 0; i < users.length; i++) {
            socket.to(users[i].id).emit('msg-recieve', formatMessage(user.username, msg));
        }
        // io.to(user.room).emit('msg-receive', { msg: msg });
    });

    // Run when client disconnects Chat Messages
    socket.on('disconnect-room', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('msg-receive', formatMessage(botName, `${user.username} has left the chat`));
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});
