require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const db = require('./db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ---- View engine and static files ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Reading form data ----
app.use(express.urlencoded({ extended: false }));

// ---- Sessions ----
if (!process.env.SESSION_SECRET) {
  console.warn('SESSION_SECRET is not set in .env. Using an insecure development value.');
}
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

// ---- Variables available in EVERY view ----
// Flash message: set  req.session.flash = 'Saved!'                         (green success)
//            or      req.session.flash = { type: 'error', message: '...' } (red)
//            or      req.session.flash = { type: 'info',  message: '...' } (purple notice)
// then redirect. It shows once on the next page.
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.success = null;
  res.locals.info = null;
  res.locals.errors = [];

  const flash = req.session.flash;
  delete req.session.flash;
  if (typeof flash === 'string') {
    res.locals.success = flash;
  } else if (flash && flash.message) {
    if (flash.type === 'error') res.locals.errors = [flash.message];
    else if (flash.type === 'info') res.locals.info = flash.message;
    else res.locals.success = flash.message;
  }
  next();
});

// ---- Routes ----
// ORDER MATTERS: create and manage (/opportunities/new, /:id/edit) must come
// BEFORE browse (/opportunities/:id), or "new" would be read as an ID.
// A route file that is missing or still empty is skipped with a warning, so
// the app runs while teammates are still writing their parts.
function mount(file) {
  if (!fs.existsSync(path.join(__dirname, file + '.js'))) {
    console.warn(`[app] ${file}.js not found - skipped`);
    return;
  }
  const router = require(file);
  if (typeof router === 'function') app.use(router);
  else console.warn(`[app] ${file}.js has no router yet - skipped`);
}
app.get('/', (req, res) => res.redirect('/opportunities'));
mount('./modules/accounts/authRoutes');
mount('./modules/create/createRoutes');
mount('./modules/manage/manageRoutes');
mount('./modules/browse/browseRoutes');

// ---- 404 and errors (keep these last) ----
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found' });
});
app.use(errorHandler);

// ---- Start ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  db.query('SELECT 1')
    .then(() => console.log('MySQL connected'))
    .catch((err) => console.error('MySQL connection FAILED:', err.message));
});