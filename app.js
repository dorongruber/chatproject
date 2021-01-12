
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()


const {
  JoinUsersPhool,
  userJoinRoom,
  userLeaveRoom,
  userLeaveSite,
  getPhoolUsers,
  getCurrentUserInRoom,
  getUserFromPhool
} = require('./src/app/utils/user');

const userRouter = require('./back/routes/user');
const mapRouter = require('./back/routes/map');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'dist/chatproject')));
app.use(cors());
app.use(bodyParser.json());
app.use('/api/user', userRouter);
app.use('/api/map', mapRouter);

mongoose.connect( process.env.DEV_BD_CONNECTION || process.env.PRO_BD_CONNECTION,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log('connection failed -> ', err);
  })

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept,Authorization, Content-Length"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist/chatproject/index.html'))
  })

const port = process.env.PORT || 8080;
server.listen(port , () => console.log(`listening on port ${port}`))

const BotName = 'ChatCord Bot';

io.on('connection', (socket) => {

  socket.on('NewConnectionToPhool', ({username, room, userid}) => {
    const isconnected = getUserFromPhool(userid);
    // console.log('NewConnectionToPhool room -> ', room);
    // conectedusers => cnu
    var cnu = [];
    var reslistFormat = [];
    if (isconnected === undefined) {
      console.log('NewConnectionToPhool -> user isnt connected yet');
      // id,name,room,phone, socketid
      const userInPhool = JoinUsersPhool(userid,username, socket.id);
      socket.join(room);
      cnu = getPhoolUsers();
    } else {
      console.log('NewConnectionToPhool -> user is allready connected');
      cnu = getPhoolUsers();
    }
    cnu.forEach(u => {
      reslistFormat.push({
        name: u.name,
        uid: u.id
      });
    });
    // console.log('cnu -> ', reslistFormat, username);
    io.in(room).emit('NewUser', {reslistFormat});
  })

  socket.on('ConnectToChat', ({id, chatId, chatname}) => {
    console.log('ConnectToChat -> ', id);
    const user = getUserFromPhool(id);
    const roomuser = userJoinRoom(id,user.name,chatname,chatId);

    socket.join(roomuser.roomid);
  })

  socket.on('NewGroupChat',({fromId, roomName}) => {
    let response = {
      sourceId: fromId,
      destinationId: fromId,
      roomname: roomName,
      roomId: `${roomName}_${fromId}`
    };

    socket.emit('NewChat', {response});
  })

  socket.on('NewUserToGroupChat', ({fromId, toId, roomName, roomId}) => {
    console.log('NewUserToGroupChat');
    const touser = getUserFromPhool(toId);

    let response = {
      sourceId: fromId,
      destinationId: toId,
      roomname: roomName,
      roomId: roomId
    };

    io.to(touser.socketid).emit('NewChat', {response});
  })

  socket.on('NewPrivateChat', ({fromId,fromName,toId,toName}) => {
    console.log('NewChat fromId,fromName,toId,toName ->', fromId,fromName,toId,toName);
    const touser = getUserFromPhool(toId);

    let response = {
      sourceId: fromId,
      destinationId: toId,
      roomname: fromName,
      roomId: `${fromId}_${toId}`
    };

    io.to(touser.socketid).emit('NewChat', {response});

    response = {
      sourceId: toId,
      destinationId: fromId,
      roomname: toName,
      roomId: `${fromId}_${toId}`
    }

    socket.emit('NewChat', {response});
  })

  socket.on('JoinChatRoomNotification', ({uname,uid,roomid,roomname}) => {
    const td = new Date();
    const currentTime = {
    d: td.getDate(),
    mo: td.getMonth() + 1,
    h: td.getHours(),
    mi: td.getMinutes()
    };
    console.log('JoinChatRoomNotification');
    socket.emit('NewChatMessage', {message: `Welcome ${uname}`, username: BotName, time: currentTime, chatname: roomname,chatid: roomid});

    socket.to(roomid)
      .emit('NewChatMessage',
      {message: `${uname} Has Joined The Chat`, username: BotName, time: currentTime, chatname:roomname,chatid: roomid});
  })

  socket.on('NewChatMessage', ({ msg, username, userid, time, chatid}) => {
    const user = getCurrentUserInRoom(userid,chatid);
    console.log('NewChatMessage -> ', chatid);
    io.in(chatid).emit('NewChatMessage', {message: msg, username, userid, time, chatname: user.chatname, chatid});
  })

  socket.on('DisconnectUserFromChats', ({userid, chats}) => {
    console.log('DisconnectUserFromChats -> chats --> ', chats);
    chats.forEach(chat => {
      const user = userLeaveRoom(userid,chat.roomId);
      socket.leave(user.roomname);
    });
  })

  socket.on('DisconnectUserFromPhool', ({userid}) => {

    const userphool = userLeaveSite(userid);
    console.log('discconnect user -> ', userphool);
    if (userphool) {
      console.log('discconnect user id -> ', userid);
      var cnu = [];
      const templist = [];
      cnu = getPhoolUsers();
      // console.log('close user socket');
      cnu.forEach(u => {
        templist.push({
          name: u.name,
          uid: u.id
        });
      });
      socket.leave('AddtoPool');
      // console.log('discconnect templist -> ', templist);
      socket.in('AddtoPool').emit('NewUser', {templist});
    }
  })

  //end io
})
