const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  next();
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - SimpleBlog' });
});

router.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 - SimpleBlog' });
});

router.get('/', (req, res, next) => {
  const posts = [];
  res.render('main', {
    title: 'SimpleBlog',
    posts,
  });
});

module.exports = router;