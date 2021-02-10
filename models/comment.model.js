const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    autopopulate: { select: "_id name avatar" },
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please enter the comment"],
    trim: true,
  },

}
  ,
  {
    timestamps: true,
  }

);
CommentSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Comment", CommentSchema);
