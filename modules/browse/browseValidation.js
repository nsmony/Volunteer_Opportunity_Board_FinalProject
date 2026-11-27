// Cleans the search form values from the query string (?q=...&category=...).
// Bad input is never an error page: it is ignored, so the list still loads.
// Result is stored in req.search = { q, category }.
const MAX_KEYWORD_LENGTH = 100;

exports.cleanSearch = (req, res, next) => {
  let q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  q = q.slice(0, MAX_KEYWORD_LENGTH);

  const rawCategory = typeof req.query.category === 'string' ? req.query.category : '';
  const category = /^[1-9]\d*$/.test(rawCategory) ? Number(rawCategory) : null;

  req.search = { q, category };
  next();
};
