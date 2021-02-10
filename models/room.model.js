const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: "_id name avatar" },
      },
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        autopopulate: { select: "_id text imgUrl createdAt" },
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: true,
  }
);
roomSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Room", roomSchema);
