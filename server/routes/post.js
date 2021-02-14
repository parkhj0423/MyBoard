const express = require('express');
const router = express.Router();
const { Post } = require('../models/Post');
const { auth } = require('../middleware/auth');

const multer = require('multer');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single('file');

//=================================
//             Board
//=================================

router.post('/savePost', (req, res) => {
  const post = new Post(req.body);

  post.save((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, result });
  });
});

router.post('/getPost', (req, res) => {
  Post.find()
    .populate('writer')
    .exec((err, result) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({ success: true, result });
    });
});

router.post('/uploadfiles', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/getDetailPost', (req, res) => {
  Post.findOne({ _id: req.body.postId })
    .populate('writer')
    .exec((err, result) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({ success: true, result });
    });
});

router.post('/deletePost', (req, res) => {
  Post.findOneAndDelete({ _id: req.body.postId }).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, result });
  });
});

router.post('/modifyPost', (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body.postId },
    {
      $set: { title: req.body.title, text: req.body.text, tags: req.body.tags,description:req.body.description },
    },
  ).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, result });
  });
});


module.exports = router;
