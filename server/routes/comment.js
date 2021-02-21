const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

//=================================
//             Comment
//=================================

router.post('/saveComment', (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) {
      return res.json({ success: false, err });
    }

    //TODO writer의 id만으로는 writer가 올린 영상정보를 받을 수 없음 기존에는 populate을 사용했지만
    //todo save 메소드에는 populate 사용불가 => Comment DB에서 find 한 후 populate
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true, result });
      });
  });
});


router.post('/getCommentsLength', (req, res) => {
  Comment.find()
    .populate('writer')
    .exec((err, comments) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.status(200).json({ success: true, comments });
    });
});

router.post('/getComments', (req, res) => {
  Comment.find({ postId: req.body.postId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.status(200).json({ success: true, comments });
    });
});

router.post('/deleteComment', (req, res) => {
  Comment.findOneAndDelete({ text: req.body.text }).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).json({ success: true, result });
  });
});

module.exports = router;
