const db = require('../db');

// Loads the opportunity and makes sure the logged-in user owns it.
// Missing record -> 404, someone else's record -> 403.
// On success the record is available as req.opportunity.
module.exports = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return next(Object.assign(new Error('Not found'), { status: 404 }));
    }
    if (rows[0].user_id !== req.session.user.id) {
      return next(Object.assign(new Error('Forbidden'), { status: 403 }));
    }
    req.opportunity = rows[0];
    next();
  } catch (err) {
    next(err);
  }
};