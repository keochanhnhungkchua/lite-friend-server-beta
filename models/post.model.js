const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: { select: "_id name avatar" },
    required: true,
  },
  text: {
    type: String,
    default: "",
    trim: true,
  },
  share: {
    type: Number,
    default: Math.ceil(Math.random() * 100),
    required: true,
  },
  imgUrl: {
    type: Array,
    default: [],
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      autopopulate: { select: "_id user text createdAt" },
      ref: "Comment",
    },
  ]
}
  ,
  {
    timestamps: true,
  }
);
postSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Post", postSchema);

// const randomSchema = mongoose.Schema({
//   name: {type: String,trim: true},
//   username: {type: String,trim: true},
//   enemies: {
//     type: ObjectId,
//     ref: randomMongooseModel,
//     autopopulate:{
//       select: '-password -randonSensitiveField' // remove listed fields from selection
//     }
//   },
//   friends: {
//     type: ObjectId,
//     ref: randomMongooseModel,
//     autopopulate:{
//       select: '_id name email username' // select only listed fields
//     }
//   }
//https://stackoverflow.com/questions/26915116/mongoose-mongodb-exclude-fields-from-populated-query-data
// });

////

// comments: {
//   type: Array,
//   default: [],
//   required: true,
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   autopopulate: { select: "_id name avatar" },
//   required: true
//   },
//   comment: {
//     type: String,
//     required: true
//   },
//   commentAt: {
//     type: Date,
//     default: Date.now
//   }
// },
