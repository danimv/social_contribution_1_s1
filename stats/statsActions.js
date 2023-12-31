const Post = require('../models/Post');

const getCountOfPostsByTipus = async (userId) => {
  try {
    const result = await Post.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: '$tipus',
          count: { $sum: 1 }
        }
      }
    ]);

    const countsByTipus = result.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    return countsByTipus;
  } catch (err) {
    console.error(err.message);
    throw new Error('Error counting posts by Tipus');
  }
};

module.exports = { getCountOfPostsByTipus };
