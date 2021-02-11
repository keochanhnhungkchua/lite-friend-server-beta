var User = require("../models/user.model");
var jwt = require("jsonwebtoken");

module.exports.index = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const userId = jwt.decode(token, { complete: true }).payload._id;
  const { friends } = await User.findById(userId)
  friends.push(userId)
  const users = await User.find({
    "_id": { $nin: friends }//except people is friend and user
  }).select("name avatar _id");
  return res.json(users);
};
module.exports.addFriend = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const userId = jwt.decode(token, { complete: true }).payload._id;
  const friendId = req.params.friendId;
  const user = await User.findById(userId).select(
    "-password -createdAt -wrongLoginCount -__v"
  );
  user.friends.push(friendId);
  await user.save();
  return res.json(user);
};


module.exports.me = async (req, res) => {
  if (req.header("Authorization")) {
    const token = req.header("Authorization").slice(7);
    const id = jwt.decode(token, { complete: true }).payload._id;
    const user = await User.findById(id).select(
      "-password -createdAt -wrongLoginCount -__v"
    );
    res.json(user);
  }
};
module.exports.getIsFriends = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const id = jwt.decode(token, { complete: true }).payload._id;
  const { friends } = await User.findById(id).select("friends");
  const user = await User.find().select("_id name avatar").where('_id').in(friends).exec();
  res.json(user);
}

module.exports.getFriends = async (req, res) => {
  const { friendId } = req.params

  const { friends } = await User.findById(friendId).select("friends");

  const user = await User.find().select("_id name avatar").where('_id').in(friends).exec();
  res.json(user);


}
//post

module.exports.postSearch = async (req, res) => {
  const { search } = req.body;
  const user = await User.find({ "name": { $regex: '^' + search, $options: 'i' } })
    .select("name avatar _id ")
    .sort({ createdAt: -1 })
    .limit(20);
  if (user.length > 0) {
    res.json({ success: true, user: user });
  } else {
    res.json({ success: false });
  }
};

module.exports.postChangeCover = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const id = jwt.decode(token, { complete: true }).payload._id;
  const user = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .select("-password -createdAt -wrongLoginCount -__v");
  res.json(user);
};