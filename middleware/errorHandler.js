// Global error handler. Must be registered LAST in app.js.
// Controllers call next(err); users only ever see a safe, generic page.
module.exports = (err, req, res, next) => {
  console.error(err); // full details go to the server console only

  if (res.headersSent) return next(err);

  const status = err.status === 400 || err.status === 403 || err.status === 404 ? err.status : 500;
  const message = status === 500
    ? 'Something went wrong. Please try again later.'
    : 'Sorry, we could not complete that request.';

  // Pass every variable the layout needs, in case the error happened early.
  const locals = {
    title: 'Error',
    message,
    user: res.locals.user || null,
    currentPath: '',
    success: null,
    info: null,
    errors: []
  };

  res.status(status).render('error', locals, (renderErr, html) => {
    if (renderErr) return res.send('Something went wrong. Please try again later.');
    res.send(html);
  });
};