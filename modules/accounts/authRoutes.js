const express = require('express');
const authController = require('./authController');
const { validateRegister } = require('./authValidation');

const router = express.Router();

function redirectAuthenticated(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/opportunities');
  next();
}

router.get('/register', redirectAuthenticated, authController.showRegister);
router.post('/register', redirectAuthenticated, validateRegister, authController.register);
router.get('/login', redirectAuthenticated, authController.showLogin);
router.post('/login', redirectAuthenticated, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
