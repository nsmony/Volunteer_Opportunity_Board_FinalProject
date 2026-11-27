const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

function validateRegister(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const errors = [];

  req.body = { username, email, password };

  if (username.length < 3 || username.length > 30) {
    errors.push('Username must be between 3 and 30 characters.');
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.push('Username can contain only letters, numbers, and underscores.');
  }

  if (email.length > 100 || !EMAIL_PATTERN.test(email)) {
    errors.push('Enter a valid email address (maximum 100 characters).');
  }

  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    errors.push('Password must be at least 8 characters and no more than 72 bytes.');
  }

  if (errors.length) {
    return res.status(400).render('auth/register', {
      title: 'Register',
      errors,
      values: { username, email }
    });
  }

  next();
}

module.exports = { validateRegister };
