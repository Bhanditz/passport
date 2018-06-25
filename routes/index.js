var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { bundle: 'index.js' });
  return next();
});

module.exports = router;
