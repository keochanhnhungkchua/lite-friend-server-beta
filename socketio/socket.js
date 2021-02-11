var Room = require("../models/room.model");
var Chat = require("../models/chat.model");
var User = require("../models/user.model");
var jwt = require("jsonwebtoken");
const cors = require("cors");
var userOnline = [];

const sockets = (server) => {
  const io = require("socket.io")(server, { cors: { origin: '*' } });
  io.on("connection", (socket) => {
    console.log("have a clien connection : " + socket.id);
    const { token } = socket.request._query;
    var isMe = "";//save its me
    if (token !== "false") {
      isMe = jwt.decode(token, { complete: true }).payload;
    }

    const isOnline = userOnline.findIndex((item) => item.user === isMe._id)
    if (isOnline < 0) {//add first socket io of user 
      userOnline.push({ socketId: socket.id, user: isMe._id });
      io.emit("getOnlineUsers", userOnline.map((item) => item.user));
    } else {//add more socket id of user 
      userOnline.push({ socketId: socket.id, user: isMe._id });

      io.emit("getOnlineUsers", [... new Set(userOnline.map((item) => item.user))]);
    }
    socket.on("getOnlineUsers", () => {
      socket.emit("getOnlineUsers", [... new Set(userOnline.map((item) => item.user))]);
    })
    socket.on("disconnect", () => {
      console.log(socket.id + "  disconnect");
      const numberSocketIdOfUser = userOnline.filter((item) => item.user === isMe._id)
      //if >1 remove this socket of user( when user open many tab will have many socket id)
      if (numberSocketIdOfUser.length > 1) {
        userOnline = userOnline.filter((item) => item.socketId !== socket.id);
      } else {
        //when =0 user close all tab,=> send user offline
        userOnline = userOnline.filter((item) => item.socketId !== socket.id);
        io.emit("getOnlineUsers", [... new Set(userOnline.map((item) => item.user))]);
        // Remove duplicate values
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
      }
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(socket.adapter.rooms);
    });
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(socket.adapter.rooms);
    });

    socket.on("privateMessageSocketio", async (data) => {
      const room = await Room.findById(data.roomId);
      const chat = await Chat.create(data);
      room.chats.push(chat._id);
      await room.save();
      io.in(data.roomId).emit("privateMessageSocketio", data);
      //when reciver offline or online but not in room => send notification     
      const userReciveId = room.users.filter((item) =>
        String(item._id) !== isMe._id);
      const userReciveSocketId = userOnline.filter((item) =>
        item.user === String(userReciveId[0]._id))//
      const userReciveInRoom = () => {
        var b = []
        userReciveSocketId.forEach((user) => {
          b.push(socket.adapter.sids.get(user.socketId).has(data.roomId))
        })
        return (b.every((item) => item === false))
      }

      if (userReciveInRoom()) {
        const userRecive = await User.findById(userReciveId)
        if (userRecive.notifications.indexOf(data.roomId) < 0) {
          userRecive.notifications.push(data.roomId)
          await userRecive.save();
          userReciveSocketId.forEach((user) => {
            io.in(user.socketId).emit("notifications", userRecive.notifications)
          })
        }
      }
    });
  });
};

module.exports = sockets;


// var clients = socket.adapter.rooms.get("room id")//so ng trong 1 room
//   const clientSocket = io.sockets.adapter.sids.get("socket id")//so room 1 socket dag login
//  console.log(clientSocket)