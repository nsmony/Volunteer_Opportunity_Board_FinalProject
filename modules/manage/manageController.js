const db = require('../../db');
const { removeFile } = require('../../middleware/upload');
const { getCategories } = require('../../middleware/validateOpportunity');

// GET /opportunities/mine
exports.showMine = async (req, res, next) => {
  try {
    const [opportunities] = await db.query(
      `SELECT o.*, c.name AS category_name, u.username
         FROM opportunities o
         JOIN categories c ON c.id = o.category_id
         JOIN users u ON u.id = o.user_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC, o.id DESC`,
      [req.session.user.id]
    );
    res.render('opportunities/mine', {
      title: 'My Opportunities',
      opportunities,
      showActions: true
    });
  } catch (err) {
    next(err);
  }
};

// GET /opportunities/:id/edit  (checkOwnership already loaded req.opportunity)
exports.editForm = async (req, res, next) => {
  try {
    res.render('opportunities/form', {
      title: 'Edit Opportunity',
      heading: 'Edit Opportunity',
      submitLabel: 'Save changes',
      formAction: `/opportunities/${req.opportunity.id}/edit`,
      formErrors: [],
      categories: await getCategories(),
      opportunity: req.opportunity
    });
  } catch (err) {
    next(err);
  }
};

// POST /opportunities/:id/edit  (after upload + validateOpportunity)
exports.update = async (req, res, next) => {
  try {
    const d = req.cleanData;
    const oldImage = req.opportunity.image_filename;
    const image = req.file ? req.file.filename : oldImage; // keep old image unless a new one was sent

    const [result] = await db.query(
      `UPDATE opportunities
          SET category_id = ?, title = ?, description = ?, location = ?, status = ?, image_filename = ?
        WHERE id = ? AND user_id = ?`,
      [d.category_id, d.title, d.description, d.location, d.status, image,
       req.params.id, req.session.user.id]
    );

    if (result.affectedRows === 0) {
      if (req.file) removeFile(req.file.filename);
      return next(Object.assign(new Error('Forbidden'), { status: 403 }));
    }

    if (req.file && oldImage) removeFile(oldImage);
    req.session.flash = 'Opportunity updated.';
    res.redirect(`/opportunities/${req.params.id}`);
  } catch (err) {
    if (req.file) removeFile(req.file.filename);
    next(err);
  }
};

// POST /opportunities/:id/delete
exports.remove = async (req, res, next) => {
  try {
    const [result] = await db.query(
      'DELETE FROM opportunities WHERE id = ? AND user_id = ?',
      [req.params.id, req.session.user.id]
    );
    if (result.affectedRows === 0) {
      return next(Object.assign(new Error('Forbidden'), { status: 403 }));
    }
    removeFile(req.opportunity.image_filename);
    req.session.flash = 'Opportunity deleted.';
    res.redirect('/opportunities/mine');
  } catch (err) {
    next(err);
  }
};