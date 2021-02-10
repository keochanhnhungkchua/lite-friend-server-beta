var express = require("express");
var router = express.Router();
var controller = require("../controllers/post.controller");

router.get("/", controller.index); //get post
router
  .post("/", controller.postAdd)
  .delete("/:postId", controller.deletePost)
  .put("/:postId", controller.editPost);
router.get("/:postId/like", controller.like); //like and unlike
router
  .post("/:postId/comment", controller.addComment)
  .get("/:postId/comment", controller.commentByPostId);

router.get("/profile/:userId", controller.profile); //load all post of user
module.exports = router;
