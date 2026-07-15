require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const User = require("./models/User");
const Message = require("./models/Message");
const path = require("path");

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/rooms", roomRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.set('io', io);

const onlineUsers = new Map();   //const onlineUsers = new Set(); // تخزين اونلاين

io.on('connection', (socket)=>{
 const token = socket.handshake.query.token;

  if(!token){
    socket.emit('error', 'Authentication error: No token provided');
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId).then((user) =>{
      if(!user){
        socket.emit('error', 'Authentication error: User not found');
        socket.disconnect();
        return;
      }
      socket.data.userId = user._id.toString();
      socket.data.user = user;
      console.log('User connected: ' + user.username);

      onlineUsers.set(socket.data.userId, socket.id);   //onlineUsers.add(socket.data.userId);
      io.emit('user-online', { userId: socket.data.userId, username: user.username });

      // الانضمام الى الغرف
      socket.on('join-room', async (data) =>{ // join-room is an event added to socket
        const roomId = data.roomId;  // data sent by frontend
        if(!roomId){
          socket.emit('error', 'Room ID is required to join a room');
          return;
        }

        if(!socket.data.userId){
          socket.emit('error', 'Authentication error: User not authenticated');
          return;
        }

        try {
          const Room = require('./models/Room');
          const room = await Room.findById(roomId);
          if(!room){
            socket.emit('error', 'Room not found');
            return;
          }
          if(room.isPrivate){
            const isMember= room.members?.some(
              (m) => m.toString() === socket.data.userId
            );
             if(!isMember){
              socket.emit('error', 'Access denied: You are not a member of this private room');
              return;
             }
             await socket.join(roomId);
             socket.emit('joined-room', { roomId });
             console.log(`User ${socket.data.user.username} joined private room ${room.name}`);
          }
        } catch (error) {
          socket.emit('error', 'Error occurred while joining room: ' + error.message);
        }
      })

      // ارسال رسالة
      socket.on('send-message', async (data) => {  //create an event named as send-message and data from frontend
        const { roomId, text } = data || {};
        if(!roomId || !text?.trim()){
          socket.emit('error', 'Room ID and message text are required');
          return;
        }
        if(!socket.data.userId){
          socket.emit('error', 'Authentication error: User not authenticated');
          return;
        }

        try {
          const message = await Message.create({
            room: roomId,
            user: socket.data.userId,
            text: text.trim(),
          })

          const populated = await Message.findById(message._id)   //populated will contain the message and username and displayname
          .populate("user", "username displayName avatar")
          .lean();

          io.to(roomId).emit('new-message', populated);  // to method to send(emit) by roomid event named new-message contain populated
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', 'Error occurred while sending message: ' + error.message);
        }
      })

      // اشعار الكتابة
      socket.on('typing-start', (data)=>{
        const roomId = data.roomId;
        if(!roomId || !socket.data.userId) return;
        socket.to(roomId).emit('user-typing',{
          userId: socket.data.userId,
          username: socket.data.user.username,
        })
      })


      // اشعار توقف الكتابة
      socket.on('typing-stop', (data)=>{
        const roomId = data.roomId;
        if(!roomId || !socket.data.userId) return;
        socket.to(roomId).emit('user-stop-typing',{
          userId: socket.data.userId,
          username: socket.data.user.username,
        })
      })

    }).catch((err) =>{
      socket.emit('error', 'Authentication error: ' + err.message);
      socket.disconnect();
    })
}catch(error){
    socket.emit('error', 'Authentication error: ' + error.message);
    socket.disconnect();
    }

  socket.on('disconnect', () => {
     if(socket.data.userId){
      onlineUsers.delete(socket.data.userId);
      io.emit('user-offline', { userId: socket.data.userId });
    }
    console.log('user disconnected: ' + socket.id);
  })
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});