const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const contribType = require('../../models/contribType');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const ValidatePostInput = require('../../validation/post');
const multer = require('multer');
const { getCountOfPostsByTipus } = require('../../stats/statsActions');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Set your desired destination directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 35, // 5 MB limit (adjust as needed)
  },
});

router.get('/contribtypes', async (_req, res) => {
  try {
    const contribtypes = await contribType.find({});
    res.send(contribtypes);
  } catch (err) {
    console.log(err);
  }
});

// GET api/posts
// get posts
// @access public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// GET api/posts/:id
// get posts by id
// @access public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// POST api/posts
// create post
// @access private

router.post('/', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
  // const { errors, isValid } = ValidatePostInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  try {
    console.log(req.body);
    if (req.file && req.file.filename) {
      console.log(req.file.filename);
      const newPost = new Post({
        text: req.body.description,
        name: req.body.name,
        user: req.user.id,
        quantitat: req.body.quantitat,
        tipus: req.body.tipus,
        unitat: req.body.unitat,
        lloc: req.body.lloc,
        hora: req.body.hora,
        data: req.body.data,
        imgUrl: req.file.filename,
        imageName: req.file.filename,
      });
      newPost.save().then((posts) => res.json(posts));
    } else {
      // Handle the case where the file is not provided or not uploaded
      console.log('File not provided or uploaded.');
    }
  } catch (err) {
    console.log(err);
  }
});

// DELETE api/posts/:id
// delete a posts
// @access private

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }
        // delete
        post.remove().then(() => {
          res.json({ success: true });
        });
      })
      .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
  });
});

// POST api/posts/like/:id
// like posts
// @access private

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({ alreadyliked: 'User already liked this post' });
        }

        // add user id to likes array
        post.likes.unshift({ user: req.user.id });
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
  });
});

// POST api/posts/unlike/:id
// unlike posts
// @access private

router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({ notliked: 'You have not yet liked this post' });
        }

        // get index on item to remove from like array
        const removeIndex = post.likes.map((item) => item.user.toString()).indexOf(req.user.id);

        // remove from array
        post.likes.splice(removeIndex, 1);

        // save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
  });
});

// POST api/posts/comment/:id
// add comment to post
// @access private

router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  //check validation
  const { errors, isValid } = ValidatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        imgUrl: req.body.imgUrl,
        user: req.user.id,
      };

      // add to comments array
      post.comments.unshift(newComment);

      // save comment
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
});

// DELETE api/posts/comment/:id/:/comment_id
// delete comment to post
// @access private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      // check to see if comment exists
      if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' });
      }

      // get remove index

      const removeIndex = post.comments.map((item) => item._id.toString()).indexOf(req.params.comment_id);

      // remove comment
      post.comments.splice(removeIndex, 1);

      // save
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;
