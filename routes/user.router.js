const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");


router.get("/", controller.index);
router.get("/me", controller.me);
router.get("/addFriend/:friendId", controller.addFriend);
router.post("/search", controller.postSearch);
router.post("/changeCover", controller.postChangeCover)
router.get("/me/friends", controller.getIsFriends)
router.get("/me/friends/:friendId", controller.getFriends)
module.exports = router;
