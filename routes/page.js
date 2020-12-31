const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  const posts = [];
  res.render('main', {
    title: 'SimpleBlog',
    posts,
  });
});

module.exports = router;