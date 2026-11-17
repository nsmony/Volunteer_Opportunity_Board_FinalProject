const path = require('node:path');
const bcrypt = require('bcrypt');
const db = require('../../../db');
const { validateRegister } = require('./validateRegister');
const { establishUserSession } = require('../session/sessionHelpers');

const registerView = path.join(__dirname, 'view.ejs');
const SALT_ROUNDS = 12;

function showRegister(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }

  return res.render(registerView, {
    errors: [],
    values: { name: '', email: '' }
  });
}

async function register(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }

  const { errors, values, password } = validateRegister(req.body || {});
  if (errors.length > 0) {
    return res.status(422).render(registerView, { errors, values });
  }

  const [existingUsers] = await db.execute(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [values.email]
  );
  if (existingUsers.length > 0) {
    return res.status(409).render(registerView, {
      errors: ['An account with that email address already exists.'],
      values
    });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  let result;

  try {
    const [insertResult] = await db.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [values.name, values.email, passwordHash]
    );
    result = insertResult;
  } catch (error) {
    if (error.code !== 'ER_DUP_ENTRY') {
      throw error;
    }

    return res.status(409).render(registerView, {
      errors: ['An account with that email address already exists.'],
      values
    });
  }

  await establishUserSession(req, {
    id: result.insertId,
    name: values.name,
    email: values.email
  });
  req.session.accountNotice = 'Your account has been created.';
  return res.redirect('/');
}

module.exports = { register, showRegister };
