// Cleans the search box and category filter from the query string.
// Result: req.search = { q: '', category: null | number }
module.exports = function validateSearch(req, res, next) {
  const q = String(req.query.q || '').trim().slice(0, 100);
  const category = Number(req.query.category);
  req.search = {
    q,
    category: Number.isInteger(category) && category > 0 ? category : null
  };
  next();
};