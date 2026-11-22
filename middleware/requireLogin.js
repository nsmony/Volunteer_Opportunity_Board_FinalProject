module.exports = (req, res, next) => {
  if (req.session && req.session.user) return next();

  if (req.session) {
    req.session.flash = { type: 'info', message: 'Please log in to continue.' };
  }
  res.redirect('/login');
};
