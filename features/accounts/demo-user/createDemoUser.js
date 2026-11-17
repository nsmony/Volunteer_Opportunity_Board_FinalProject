require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../../../db');
const { validateRegister } = require('../register/validateRegister');

const SALT_ROUNDS = 12;

async function createDemoUser() {
  const name = process.env.DEMO_USER_NAME;
  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'Set DEMO_USER_NAME, DEMO_USER_EMAIL, and DEMO_USER_PASSWORD before running this script.'
    );
  }

  const validation = validateRegister({
    name,
    email,
    password,
    confirmPassword: password
  });
  if (validation.errors.length > 0) {
    throw new Error(validation.errors.join(' '));
  }

  const [existingUsers] = await db.execute(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [validation.values.email]
  );
  if (existingUsers.length > 0) {
    throw new Error(
      `A user with email ${validation.values.email} already exists; no changes were made.`
    );
  }

  const passwordHash = await bcrypt.hash(validation.password, SALT_ROUNDS);
  await db.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [validation.values.name, validation.values.email, passwordHash]
  );

  console.log(`Created demo user: ${validation.values.email}`);
}

async function main() {
  try {
    await createDemoUser();
  } finally {
    await db.end();
  }
}

main()
  .catch((error) => {
    console.error(`Could not create demo user: ${error.message}`);
    process.exitCode = 1;
  });
