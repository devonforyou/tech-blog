const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes');
const apiRoutes = require('./apiRoutes');

// Check if htmlRoutes and apiRoutes are middleware functions
if (typeof htmlRoutes === 'function') {
  router.use(htmlRoutes);
} else {
  console.error('htmlRoutes is not a valid middleware function.');
}

if (typeof apiRoutes === 'function') {
  router.use('/api', apiRoutes);
} else {
  console.error('apiRoutes is not a valid middleware function.');
}

module.exports = router;