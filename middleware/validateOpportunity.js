const db = require('../db');
const { removeFile } = require('./upload');

async function getCategories() {
  const [rows] = await db.query('SELECT id, name FROM categories ORDER BY name');
  return rows;
}

// Used for BOTH create and edit. Run it after `upload`.
// Valid   -> req.cleanData = { title, description, location, category_id, status }
// Invalid -> re-renders views/opportunities/form.ejs with the messages and
//            the values the user typed, and deletes any image just uploaded.
async function validateOpportunity(req, res, next) {
  try {
    const body = req.body || {};
    const data = {
      title: String(body.title || '').trim(),
      description: String(body.description || '').trim(),
      location: String(body.location || '').trim(),
      category_id: Number(body.category_id),
      status: body.status === 'closed' ? 'closed' : 'open'
    };

    const errors = [];
    if (!data.title) errors.push('Title is required.');
    else if (data.title.length > 120) errors.push('Title must be 120 characters or fewer.');

    if (!data.description) errors.push('Description is required.');
    else if (data.description.length < 10) errors.push('Description must be at least 10 characters.');
    else if (data.description.length > 5000) errors.push('Description must be 5000 characters or fewer.');

    if (!data.location) errors.push('Location is required.');
    else if (data.location.length > 150) errors.push('Location must be 150 characters or fewer.');

    const categories = await getCategories();
    if (!categories.some((c) => c.id === data.category_id)) errors.push('Please choose a valid category.');

    if (req.uploadError) errors.push(req.uploadError);

    if (errors.length === 0) {
      req.cleanData = data;
      return next();
    }

    if (req.file) removeFile(req.file.filename);

    const isEdit = Boolean(req.params.id);
    res.status(400).render('opportunities/form', {
      title: isEdit ? 'Edit Opportunity' : 'New Opportunity',
      heading: isEdit ? 'Edit Opportunity' : 'Post a New Opportunity',
      submitLabel: isEdit ? 'Save changes' : 'Post opportunity',
      formAction: isEdit ? `/opportunities/${req.params.id}/edit` : '/opportunities',
      formErrors: errors,
      categories,
      opportunity: { ...(req.opportunity || {}), ...data }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = validateOpportunity;
module.exports.getCategories = getCategories;