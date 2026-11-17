const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD_BYTES = 72;

function validateRegister(input) {
  input = input || {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const password = typeof input.password === 'string' ? input.password : '';
  const confirmPassword = typeof input.confirmPassword === 'string'
    ? input.confirmPassword
    : '';
  const errors = [];

  if (name.length < 2 || name.length > 80) {
    errors.push('Name must be between 2 and 80 characters.');
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.push('Enter a valid email address.');
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  } else if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    errors.push('Password must not exceed 72 bytes.');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match.');
  }

  return {
    errors,
    values: { name, email },
    password
  };
}

module.exports = { validateRegister };
