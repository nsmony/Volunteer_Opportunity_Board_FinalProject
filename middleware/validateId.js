// Checks that :id in the URL is a positive whole number.
// Anything else (abc, 0, -5, 1.5, huge numbers) gets the 404 page, and the
// database is never queried. On success the number is stored in req.id.
module.exports = (req, res, next) => {
  const raw = req.params.id;
  const valid = /^[1-9]\d*$/.test(raw) && Number(raw) <= 4294967295; // INT UNSIGNED max

  if (!valid) {
    return res.status(404).render('404', {
      title: 'Not found',
      message: 'That opportunity does not exist, or it was removed.'
    });
  }

  req.id = Number(raw);
  next();
};
