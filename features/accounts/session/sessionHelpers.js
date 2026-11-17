function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function establishUserSession(req, user) {
  await regenerateSession(req);
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function safeReturnTo(value) {
  if (
    typeof value !== 'string'
    || !value.startsWith('/')
    || value.startsWith('//')
    || value.includes('\\')
  ) {
    return '/';
  }

  return value;
}

module.exports = { establishUserSession, safeReturnTo };
