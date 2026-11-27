const db = require('../../db');
const { getCategories } = require('../../middleware/validateOpportunity');

// GET /opportunities/new
exports.showForm = async (req, res, next) => {
  try {
    res.render('opportunities/form', {
      title: 'New Opportunity',
      heading: 'Post a New Opportunity',
      submitLabel: 'Post opportunity',
      formAction: '/opportunities',
      formErrors: [],
      categories: await getCategories(),
      opportunity: { title: '', description: '', location: '', category_id: '', status: 'open' }
    });
  } catch (err) {
    next(err);
  }
};

// POST /opportunities  (runs after upload + validateOpportunity)
exports.create = async (req, res, next) => {
  try {
    const d = req.cleanData;
    const image = req.file ? req.file.filename : null;
    const [result] = await db.query(
      `INSERT INTO opportunities
         (user_id, category_id, title, description, location, status, image_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.session.user.id, d.category_id, d.title, d.description, d.location, d.status, image]
    );
    req.session.flash = 'Opportunity posted.';
    res.redirect(`/opportunities/${result.insertId}`);
  } catch (err) {
    next(err);
  }
};