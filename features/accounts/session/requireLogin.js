function requireLogin(req, res, next) {
  if (req.session.user) {
    return next();
  }

  const returnTo = encodeURIComponent(req.originalUrl);
  return res.redirect(`/login?returnTo=${returnTo}`);
}

module.exports = { requireLogin };
