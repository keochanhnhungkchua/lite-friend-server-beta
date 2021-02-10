var Room = require("../models/room.model");
var Chat = require("../models/chat.model");
var User = require("../models/user.model");
var jwt = require("jsonwebtoken");

//get all room of user
module.exports.room = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const id = jwt.decode(token, { complete: true }).payload._id;
  const rooms = await Room.find({ users: id })
    .limit(20)
    .sort({ createdAt: -1 })
    .select("-__v  ");
  res.json(rooms);
};

module.exports.roomId = async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId);
  return res.json(room);
};
//add room
module.exports.postRoomId = async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.find({ name: roomId });

  if (room.length !== 0) {
    return res.json(room[0]);
  } else {
    const newRoom = new Room({
      name: roomId,
      users: req.body,
    });
    await newRoom.save();
    return res.json(newRoom);
  }
};
//notifications
module.exports.notifications = async (req, res) => {
  const { roomId } = req.params
  const token = req.header("Authorization").slice(7);
  const userId = jwt.decode(token, { complete: true }).payload._id;
  const user = await User.findById(userId);
  user.notifications = user.notifications.filter((id) => id !== roomId)
  await user.save();
  return res.json(user.notifications)
}