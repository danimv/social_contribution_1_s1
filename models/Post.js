const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  lloc: {
    type: String
  },
  tipus: {
    type: String
  },
  quantitat: {
    type: String
  },
  unitat: {
    type: String
  },
    hora: {
    type: String
  },
  data: {
    type: String
  },
  imgUrl: {
    type: String
  },
  imageName: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
