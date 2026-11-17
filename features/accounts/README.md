# Accounts feature (Member 1)

This self-contained feature provides registration, login, logout, session user
data, and the login guard. The files are grouped by sub-feature:

- `register/`: registration handler, validation, and view
- `login/`: login handler and view
- `session/`: session setup helpers, login guard, and logout handler
- `demo-user/`: command-line demo-user creation

## Integration requirements

The shared app should:

1. Configure EJS as its view engine and serve `public/` at `/`.
2. Parse URL-encoded form bodies.
3. Configure `express-session` before mounting the account router.
4. Export a `mysql2/promise` pool from the root `db.js`, with `execute()` and
   `end()` methods.
5. Mount this router with `app.use(require('./features/accounts'))`.

The router provides `res.locals.currentUser` (`null` when logged out) and
consumes `req.session.accountNotice` for account-page notices. A logged-in
session stores only `{ id, name, email }` in `req.session.user`.

## Database contract

The shared schema must provide a `users` table with `id`, `name`, `email`, and
`password_hash` columns. `email` must have a unique index: the pre-insert
duplicate check gives a friendly message, while the unique constraint protects
against concurrent registrations.

## Routes

- `GET /register`, `POST /register`
- `GET /login`, `POST /login`
- `POST /logout` (requires an authenticated session)

Protect private routes with
`require('./features/accounts/session/requireLogin').requireLogin`.

## Demo account

Set `DEMO_USER_NAME`, `DEMO_USER_EMAIL`, and `DEMO_USER_PASSWORD` in the
environment, then run `npm run create-demo-user`. The script hashes the
password with bcrypt and will not overwrite an existing account.
