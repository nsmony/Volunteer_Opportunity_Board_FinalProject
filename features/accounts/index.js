const express = require('express');
const { register, showRegister } = require('./register/handler');
const { login, showLogin } = require('./login/handler');
const { logout } = require('./session/logout');
const { requireLogin } = require('./session/requireLogin');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.accountNotice = req.session.accountNotice || null;
  delete req.session.accountNotice;
  next();
});

router.get('/register', showRegister);
router.post('/register', register);
router.get('/login', showLogin);
router.post('/login', login);
router.post('/logout', requireLogin, logout);

module.exports = router;
