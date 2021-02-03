const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();


router.post('/profile', async (req, res, next) => {
  try {
    await User.update({ nick: req.body.nick }, {
      where: {id: req.user.id },
    });
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;