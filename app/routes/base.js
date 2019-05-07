var express = require('express');
var router = express.Router();

router.use('/:path/', function (req, res, next) {
  const path = `/${req.params.path}`;
  res.locals.getUrl = function(url) {
    return path+url;
  };
  next();
});

module.exports = router;