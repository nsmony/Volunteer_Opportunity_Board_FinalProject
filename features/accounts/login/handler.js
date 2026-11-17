const path = require('node:path');
const bcrypt = require('bcrypt');
const db = require('../../../db');
const { establishUserSession, safeReturnTo } = require('../session/sessionHelpers');

const loginView = path.join(__dirname, 'view.ejs');

function showLogin(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }

  return res.render(loginView, {
    error: null,
    returnTo: safeReturnTo(req.query.returnTo),
    signedOut: req.query.signedOut === '1'
  });
}

async function login(req, res) {
  if (req.session.user) {
    return res.redirect('/');
  }

  const body = req.body || {};
  const email = typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const returnTo = safeReturnTo(body.returnTo);

  if (!email || !password) {
    return res.status(400).render(loginView, {
      error: 'Enter your email and password.',
      returnTo,
      signedOut: false
    });
  }

  const [users] = await db.execute(
    'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  const user = users[0];
  const passwordMatches = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!passwordMatches) {
    return res.status(401).render(loginView, {
      error: 'Email or password is incorrect.',
      returnTo,
      signedOut: false
    });
  }

  await establishUserSession(req, user);
  req.session.accountNotice = `Welcome back, ${user.name}.`;
  return res.redirect(returnTo);
}

module.exports = { login, showLogin };
