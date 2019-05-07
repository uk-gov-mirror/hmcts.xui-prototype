var express = require('express');
var router = express.Router();

router.use('/:version/', function (req, res, next) {
  const version = `/${req.params.version}`;
  res.locals.getUrl = function(url) {
    return version+url;
  };
  next();
});

module.exports = router;