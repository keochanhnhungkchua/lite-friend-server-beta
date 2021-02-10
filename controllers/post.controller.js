var Post = require("../models/post.model");
var Comment = require("../models/comment.model");
var User = require("../models/user.model");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//get all post
module.exports.index = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
  res.json(posts);
};
//add post
module.exports.postAdd = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);
    const user = jwt.decode(token, { complete: true }).payload._id;
    const { text, imgUrl } = req.body;

    const newPost = new Post({
      user,
      text,
      imgUrl,
    });
    await newPost.save();
    return res.json(newPost);
  } catch (error) {
    return res.send(error);
  }
};
//delete a post
module.exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const token = req.header("Authorization").slice(7);
  const { _id } = jwt.decode(token, { complete: true }).payload;
  const post = await Post.findById(req.params.postId);
  const ids = post.comments.map((comment) => comment._id);

  if (post.user._id.toString() === _id) {
    await Comment.deleteMany({ _id: { $in: ids } });
    await Post.findByIdAndDelete(postId);
    const tt = await Comment.find({ _id: { $in: ids } }).limit(10);
    res.json({ success: true });
  } else {
    res.json("you are not allowed delete this post");
  }
};
//edit  a post
module.exports.editPost = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const { _id } = jwt.decode(token, { complete: true }).payload;
  const id = req.params.postId;
  const validaId = mongoose.Types.ObjectId.isValid(id);
  if (!validaId) {
    return res.status(404).json({ error: "Please provide correct id" });
  }
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: "No post found" });
  }

  if (post.user._id.toString() === _id) {
    await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: req.body },
      { new: true }
    );
    const post = await Post.findById(id);
    res.json({ success: true, post: post });
  } else {
    res.json("you are not allowed edit this post");
  }
};

//like on post
module.exports.like = async (req, res) => {
  const token = req.header("Authorization").slice(7);
  const userId = jwt.decode(token, { complete: true }).payload._id;
  const post = await Post.findById(req.params.postId);
  const { likes } = post;

  if (likes.length === 0) {
    post.likes = [userId];
    await post.save();
    return res.json(post);
  } else {
    const index = likes.indexOf(userId);
    if (index === -1) {
      post.likes = [...likes, userId];
      await post.save();
      return res.json(post);
    } else {
      post.likes = [...likes.slice(0, index), ...likes.slice(index + 1)];
      await post.save();
      return res.json(post);
    }
  }
};
//get post by userId
module.exports.profile = async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);
  // res.json(posts);
  const user = await User.findById(userId).select(
    "-password -createdAt -wrongLoginCount -__v"
  );
  res.json({ posts: posts, user: user });
};
//comment on post
module.exports.addComment = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  const token = req.header("Authorization").slice(7);
  const userId = jwt.decode(token, { complete: true }).payload._id;

  if (!post) {
    return resstatus(404).json("the post not exists");
  }

  let comment = await Comment.create({
    user: userId,
    post: req.params.postId,
    text: req.body.comment,
  });
  post.comments.push(comment._id);
  await post.save();
  res.status(200).json(post);
};
//get commend by postId
module.exports.commentByPostId = async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .limit(5);
  res.json(comments);
};
//delete comment
module.exports.deleteComment = async (req, res) => { };
