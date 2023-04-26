const express = require('express');
const router = express.Router();
const UserDetails = require('../models/userDetails'); // добавляем импорт модели
const User = require('../models/user'); // добавляем импорт модели


router.get('/', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    res.render('dashboard', { session: req.session });
});

router.get('/user-data', async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.redirect('/dashboard');
  }

  // Ищем запись о пользователе
  let userDetails = await UserDetails.findOne({ user: req.session.user._id });

  res.render('userDataForm', { session: req.session, userDetails: userDetails });
});


router.get('/profile/:id', async (req, res) => {
  const userDetails = await UserDetails.findOne({ user: req.params.id }).populate('user');
  if (!userDetails) {
      return res.redirect('/dashboard');
  }
  console.log(userDetails)
  res.render('userProfile', { session: req.session, userDetails: userDetails });
  
});



const multer = require('multer');
const path = require('path');

// создаем хранилище для загруженных изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/avatars');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + Date.now() + ext;
    cb(null, filename);
  }
});

// создаем объект middleware с настройками для multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
}).single('avatar');

router.post('/user-data', async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.redirect('/dashboard');
  }

  // обрабатываем загруженный файл
  upload(req, res, async (err) => {
    if (err) {
      return res.render('userDataForm', { session: req.session, error: err });
    }

    // объявляем переменную userDetails
    let userDetails;

    // Ищем запись о пользователе
    userDetails = await UserDetails.findOne({ user: req.session.user._id });

    // Если запись уже существует, то обновляем ее поля
    if (userDetails) {
      userDetails.nickname = req.body.nickname;
      userDetails.about = req.body.about;
      if (req.file) {
        userDetails.avatarUrl = '/img/avatars/' + req.file.filename;
      }
      await userDetails.save();
    } else {
      // Если записи не существует, то создаем ее
      userDetails = new UserDetails({
        user: req.body.user,
        nickname: req.body.nickname,
        about: req.body.about,
        avatarUrl: req.file ? '/img/avatars/' + req.file.filename : null,
        user: req.session.user._id,
      });
      await userDetails.save();
    }

    // Перенаправляем пользователя на страницу с данными всех пользователей
    res.redirect('/dashboard');
  });
});



module.exports = router;