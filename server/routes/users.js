const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

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
//             User
//=================================

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    },
  );
});

router.post('/getUserInfo', (req, res) => {
  User.find({ _id: req.body._id }).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, result });
  });
});

router.post('/modifyProfile', (req, res) => {
  let variable = {};
  if (req.body.name) {
    variable = {
      name: req.body.name,
      introduce: req.body.introduce,
    };
  } else {
    variable = {
      introduce: req.body.introduce,
    };
  }

  User.findOneAndUpdate({ _id: req.body._id }, variable).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, result });
  });
});

router.post('/deleteUser', (req, res) => {
  User.findOneAndDelete({ _id: req.body._id }).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ success: true, result });
  });
});

router.post('/uploadImage', (req, res) => {
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

router.post('/setImage', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    { image: req.body.image },
    (err, result) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        result,
      });
    },
  );
});

module.exports = router;
