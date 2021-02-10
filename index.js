require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var mongoose = require("mongoose");

var sockets = require("./socketio/socket");
const authMiddleware = require("./middleware/token.middleware");
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");
const storyRouter = require("./routes/story.router");
const chatRouter = require("./routes/chat.router");

const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 8000;
// app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("connect mongo db");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

sockets(server); //connect socket

app.get("/", (req, res) => {
  res.send("<h1>backen of lite friend<h1/>");
});
app.use("/api/auth", authRouter);
app.use("/api/user", authMiddleware.veryfiToken, userRouter);
app.use("/api/post", authMiddleware.veryfiToken, postRouter);
app.use("/api/story", authMiddleware.veryfiToken, storyRouter);
app.use("/api/chat", authMiddleware.veryfiToken, chatRouter);
server.listen(port, () => console.log("server listening on port :", port));
