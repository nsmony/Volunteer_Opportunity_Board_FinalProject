const db = require('../../db');

// Feature 3 + 4: list all opportunities, optionally filtered by keyword and category.
exports.list = async (req, res, next) => {
  try {
    const { q, category } = req.search;
    const where = [];
    const params = [];

    if (q) {
      // Escape % and _ so the user's text is matched literally.
      const like = '%' + q.replace(/[\\%_]/g, '\\$&') + '%';
      where.push('(o.title LIKE ? OR o.description LIKE ? OR o.location LIKE ?)');
      params.push(like, like, like);
    }
    if (category) {
      where.push('o.category_id = ?');
      params.push(category);
    }

    const sql = `
      SELECT o.id, o.title, o.description, o.location, o.status,
             o.image_filename, o.created_at, c.name AS category_name
      FROM opportunities o
      JOIN categories c ON c.id = o.category_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY o.created_at DESC, o.id DESC`;

    const [opportunities] = await db.query(sql, params);
    const [categories] = await db.query('SELECT id, name FROM categories ORDER BY name');

    res.render('opportunities/list', {
      title: 'Browse Opportunities',
      opportunities,
      categories,
      search: { q, category },
      isFiltered: Boolean(q || category)
    });
  } catch (err) {
    next(err);
  }
};

// Feature 3 (details) + 9 (404 for a missing record). req.id comes from validateId.
exports.detail = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT o.id, o.user_id, o.title, o.description, o.location, o.status,
              o.image_filename, o.created_at,
              c.name AS category_name, u.username AS posted_by
       FROM opportunities o
       JOIN categories c ON c.id = o.category_id
       JOIN users u ON u.id = o.user_id
       WHERE o.id = ?`,
      [req.id]
    );

    if (rows.length === 0) {
      return res.status(404).render('404', {
        title: 'Not found',
        message: 'That opportunity does not exist, or it was removed.'
      });
    }

    const opportunity = rows[0];
    res.render('opportunities/detail', { title: opportunity.title, opportunity });
  } catch (err) {
    next(err);
  }
};
