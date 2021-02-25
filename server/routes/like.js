const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================

router.post('/getLikes', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId };
  } else {
    variable = { commentId: req.body.commentId };
  }

  Like.find(variable).exec((err, likes) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, likes });
  });
});

router.post('/getDislikes', (req, res) => {
  let variable = {};

  if (req.body.post) {
    variable = { postId: req.body.postId };
  } else {
    variable = { commentId: req.body.commentId };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, dislikes });
  });
});

router.post('/upLike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Like DB에 클릭정보를 넣음

  const like = new Like(variable);
  like.save((err, likeResult) => {
    if (err) {
      return res.json({ success: false, err });
    }

    // 만약 Like 보다 Dislike이 먼저 클릭 되어있다면 Like 클릭시 Dislike를 1 줄임
    Dislike.findOneAndDelete(variable).exec((err, dislikeResult) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({ success: true });
    });
  });
});

router.post('/upDislike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Dislike DB에 클릭정보를 넣음

  const dislike = new Dislike(variable);
  dislike.save((err, dislikeResult) => {
    if (err) {
      return res.json({ success: false, err });
    }

    // 만약 Dislike 보다 Like이 먼저 클릭 되어있다면 Dislike 클릭시 Like를 1 줄임
    Like.findOneAndDelete(variable).exec((err, likeResult) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true });
  });
});

router.post('/unDislike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Dislike.findOneAndDelete(variable).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
