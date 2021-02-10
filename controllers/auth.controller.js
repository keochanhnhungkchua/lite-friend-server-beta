
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var User = require("../models/user.model");
var Room = require("../models/room.model");



module.exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  //check email
  if (!user) {
    const error = "Wrong email or password !";
    return res.json({ success: false, error: error });
  }
  //check wrong login
  if (user.wrongLoginCount > 5) {
    const error = "You were wrong login > 5 times please contact admin...";
    return res.json({ success: false, error: error });
  }
  //check pass
  if (password) {
    const match = await bcrypt.compareSync(password, user.password);
    if (!match) {
      user.wrongLoginCount = user.wrongLoginCount + 1;
      await user.save();
      const error = "Wrong email or password !";
      return res.json({ success: false, error: error });
    }
  }

  user.wrongLoginCount = 0;
  await user.save();
  //creat token
  const token = jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      name: user.name,
    },
    process.env.SECRET_COOKIES,
    { expiresIn: "1w" }
  );
  return res.json({
    success: "true",
    token: token,
  });
};

module.exports.postRegister = async (req, res) => {
  const checkName = await User.findOne({ name: req.body.name });
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkName && checkEmail) {
    return res.json({ success: false, error: { name: "Name was used!", email: "Email was used!" } });
  } else if (checkEmail) {
    return res.json({ success: false, error: { email: "Email was used!" } });
  } else if (checkName) {
    return res.json({ success: false, error: { name: "Name was usea!" } });
  }
  const { email, name, password } = req.body;
  const hashPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const friends = "5f2ac3e238cc8f6d22992b10"
  const newUser = await User.create({ name, email, password: hashPassword, friends });
  const roomUser = [friends, newUser._id].sort();
  const roomId = roomUser.join("-");
  await Room.create({ name: roomId, users: roomUser });
  res.status(200).json({ success: true });
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

