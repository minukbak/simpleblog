const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Category } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile - SimpleBlog' });
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { title: 'Login - SimpleBlog' });
});

router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register', { title: 'Register - SimpleBlog' });
});

router.get('/postwrite', isLoggedIn, (req, res) => {
  res.render('postwrite', { title: 'PostWrite - SimpleBlog' });
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

router.get('/category', async (req, res, next) => {
  const query = req.query.category;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const category = await Category.findOne({
      where: { category: query }
    });
    let categories = [];
    if (category) {
      categories = await category.getPosts({
        include: [{ model: User }]
      });
    }
    return res.render('main', {
      title: `${query} | SimpleBlog`,
      posts: categories,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;