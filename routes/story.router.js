const express = require("express");
const router = express.Router();
const controller = require("../controllers/story.controller");
//const authMiddleware = require("../../middleware/token.middleware");

router.get("/", controller.index).post("/", controller.postStory);

module.exports = router;
