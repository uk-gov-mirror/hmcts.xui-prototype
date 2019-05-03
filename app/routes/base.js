var express = require('express');
var router = express.Router();

router.use('/:path/', function (req, res, next) {
  res.locals.config = { path: `/${req.params.path}` };
  next();
});

module.exports = router;