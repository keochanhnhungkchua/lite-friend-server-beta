var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  cover: {
    type: String,
    default: "",
  },
  wrongLoginCount: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Array,
    default: [],
  },
  userInfo: {
    type: Object,
    default: {
      studiedAt: "",
      liveIn: "",
      from: "",
      age: 20
    }
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      autopopulate: { select: "_id avatar name" },
      ref: "User",
    }
  ]
}
  ,
  {
    timestamps: true,
  }
);
//userSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("User", userSchema);
