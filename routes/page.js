const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Title } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile - SimpleBlog' });
});

router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register', { title: 'register - SimpleBlog' });
});


router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'SimpleBlog',
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/title', async (req, res, next) => {
  const query = req.query.title;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const title = await Title.findOne({ where: { title: query } });
    let posts = [];
    if (title) {
      posts = await title.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | SimpleBlog`,
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;