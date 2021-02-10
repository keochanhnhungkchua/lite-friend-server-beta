const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: { select: "_id name avatar" },
    required: true,
  },
  imgUrl: {
    type: String,
    default: "",
  },
}
  ,
  {
    timestamps: true,
  }
);
storySchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Story", storySchema);
