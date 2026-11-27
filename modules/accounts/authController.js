const bcrypt = require('bcrypt');
const db = require('../../db');

const BCRYPT_ROUNDS = 10;

function renderLogin(res, errors, identifier) {
  return res.status(errors.length ? 400 : 200).render('auth/login', {
    title: 'Login',
    errors,
    values: { identifier }
  });
}

function establishSession(req, user, flash, callback) {
  req.session.regenerate((err) => {
    if (err) return callback(err);

    req.session.user = user;
    if (flash) req.session.flash = flash;
    req.session.save(callback);
  });
}

function showRegister(req, res) {
  res.render('auth/register', {
    title: 'Register',
    errors: [],
    values: { username: '', email: '' }
  });
}

function showLogin(req, res) {
  res.render('auth/login', {
    title: 'Login',
    errors: [],
    values: { identifier: '' }
  });
}

async function register(req, res, next) {
  const { username, email, password } = req.body;

  try {
    const [existingUsers] = await db.query(
      'SELECT username, email FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );

    if (existingUsers.length) {
      const existing = existingUsers[0];
      const errors = [];
      if (existing.username.toLowerCase() === username.toLowerCase()) {
        errors.push('That username is already taken.');
      }
      if (existing.email.toLowerCase() === email.toLowerCase()) {
        errors.push('That email address is already registered.');
      }

      return res.status(409).render('auth/register', {
        title: 'Register',
        errors,
        values: { username, email }
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const user = { id: result.insertId, username, email };
    establishSession(req, user, 'Your account has been created.', (err) => {
      if (err) return next(err);
      res.redirect('/opportunities');
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).render('auth/register', {
        title: 'Register',
        errors: ['That username or email address is already registered.'],
        values: { username, email }
      });
    }
    next(err);
  }
}

async function login(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const identifier = typeof body.identifier === 'string'
    ? body.identifier.trim()
    : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!identifier || !password || Buffer.byteLength(password, 'utf8') > 72) {
    return renderLogin(res, ['Invalid username/email or password.'], identifier);
  }

  try {
    const [users] = await db.query(
      'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );
    const account = users[0];
    const passwordMatches = account
      ? await bcrypt.compare(password, account.password_hash)
      : false;

    if (!account || !passwordMatches) {
      return renderLogin(res, ['Invalid username/email or password.'], identifier);
    }

    const user = { id: account.id, username: account.username, email: account.email };
    establishSession(req, user, null, (err) => {
      if (err) return next(err);
      res.redirect('/opportunities');
    });
  } catch (err) {
    next(err);
  }
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/login');
  });
}

module.exports = { showRegister, register, showLogin, login, logout };
