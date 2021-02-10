const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    text: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    createBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      autopopulate: { select: "_id name avatar" },
      required: true,
    },

    roomId: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
chatSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Chat", chatSchema);
