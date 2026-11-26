const db = require('../../db');
const { getCategories } = require('../../middleware/validateOpportunity');

// GET /opportunities  (list + keyword search + category filter)
exports.list = async (req, res, next) => {
  try {
    const { q, category } = req.search;
    const where = [];
    const params = [];

    if (q) {
      const like = `%${q.replace(/[\\%_]/g, '\\$&')}%`; // escape LIKE wildcards
      where.push('(o.title LIKE ? OR o.description LIKE ? OR o.location LIKE ?)');
      params.push(like, like, like);
    }
    if (category) {
      where.push('o.category_id = ?');
      params.push(category);
    }

    const [opportunities] = await db.query(
      `SELECT o.*, c.name AS category_name, u.username
         FROM opportunities o
         JOIN categories c ON c.id = o.category_id
         JOIN users u ON u.id = o.user_id
         ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
         ORDER BY o.created_at DESC, o.id DESC`,
      params
    );

    res.render('opportunities/list', {
      title: 'Volunteer Opportunities',
      opportunities,
      categories: await getCategories(),
      q,
      category,
      showActions: false
    });
  } catch (err) {
    next(err);
  }
};

// GET /opportunities/:id
exports.detail = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, c.name AS category_name, u.username
         FROM opportunities o
         JOIN categories c ON c.id = o.category_id
         JOIN users u ON u.id = o.user_id
        WHERE o.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return next(Object.assign(new Error('Not found'), { status: 404 }));
    }
    const opportunity = rows[0];
    res.render('opportunities/detail', {
      title: opportunity.title,
      opportunity,
      isOwner: Boolean(req.session.user && req.session.user.id === opportunity.user_id)
    });
  } catch (err) {
    next(err);
  }
};