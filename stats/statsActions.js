const Post = require('../models/Post');
const mongoose = require('mongoose');

const getCountOfPostsByTipus = async (userId) => {
  try {
    const result = await Post.aggregate([
      {
        $match: { tipus: { $exists: true, $ne: null }, user: mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$tipus',
          count: { $sum: 1 },
          ids: { $addToSet: '$_id' },
        },
      },
      {
        $project: {
          tipus: '$_id',
          count: 1,
          ids: 1,
          _id: 0,
        },
      },
    ]);   
    return result;
  } catch (err) {
    console.error(err.message);
    throw new Error('Error counting posts by Tipus');
  }
};

module.exports = { getCountOfPostsByTipus };
