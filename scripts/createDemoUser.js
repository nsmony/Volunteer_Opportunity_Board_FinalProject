const bcrypt = require('bcrypt');
const db = require('../db');

const DEMO_USER = {
  username: 'demo_alice',
  email: 'alice@example.com',
  password: 'Password123'
};

async function createDemoUser() {
  try {
    const [users] = await db.query(
      'SELECT username, email FROM users WHERE username = ? OR email = ? LIMIT 1',
      [DEMO_USER.username, DEMO_USER.email]
    );

    if (users.length) {
      const existing = users[0];
      if (
        existing.username.toLowerCase() === DEMO_USER.username &&
        existing.email.toLowerCase() === DEMO_USER.email
      ) {
        console.log('Demo account already exists; no changes made.');
        return;
      }
      throw new Error('The demo username or email is already used by another account.');
    }

    const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [DEMO_USER.username, DEMO_USER.email, passwordHash]
    );
    console.log('Created demo account: demo_alice / Password123');
  } finally {
    await db.end();
  }
}

createDemoUser().catch((err) => {
  console.error('Could not create demo account:', err.message);
  process.exitCode = 1;
});
