// Makes sure :id is a positive whole number, otherwise the page is a 404.
module.exports = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return next(Object.assign(new Error('Not found'), { status: 404 }));
  }
  req.params.id = String(id);
  next();
};