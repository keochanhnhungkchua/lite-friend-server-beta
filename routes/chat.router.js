const express = require("express");
const router = express.Router();
const controller = require("../controllers/chat.controller");
//const authMiddleware = require("../../middleware/token.middleware");

router.get("/room", controller.room);
router.post("/room/:roomId", controller.postRoomId);
router.get("/room/:roomId", controller.roomId);
router.get("/notifications/:roomId", controller.notifications)
module.exports = router;
