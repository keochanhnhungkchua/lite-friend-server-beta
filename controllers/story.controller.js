var Story = require("../models/story.model");
var jwt = require("jsonwebtoken");

module.exports.index = async (req, res) => {
  const storys = await Story.find()
    .limit(15)
    .sort({ createdAt: -1 })
    .select("-__v ");
  const token = req.header("Authorization").slice(7);
  //const user = jwt.decode(token, { complete: true }).payload;
  const { avatar, _id } = jwt.decode(token, { complete: true }).payload;
  const imgUrl = avatar;
  const user = { avatar, _id };
  storys.unshift(user);
  res.json(storys);
};
//add story
module.exports.postStory = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);
    const user = jwt.decode(token, { complete: true }).payload;
    const { imgUrl } = req.body;

    const newStory = new Story({
      user,
      imgUrl,
    });
    await newStory.save();
    return res.json(newStory);
  } catch (error) {
    return res.send(error);
  }
};
