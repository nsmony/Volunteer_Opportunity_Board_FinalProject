function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.redirect('/login?signedOut=1');
  });
}

module.exports = { logout };
