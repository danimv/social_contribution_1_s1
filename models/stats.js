const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const StatsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  numPosts: {
    type: String,
    required: true
  },
  transportPosts: {
    type: String
  },
  electricitatPosts: {
    type: String
  },
  reciclarPosts: {
    type: String
  },
  aiguaPosts: {
    type: String
  },  
  ponderacio: {
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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("stats", StatsSchema);
