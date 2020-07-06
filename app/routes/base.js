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

// Branching
router.post('/v3/cases/method', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  let over18 = req.session.data['over-18']

  if (over18 === 'false') {
    res.redirect('/v3/cases/details')
  } else {
    res.redirect('/v3/cases/details-post')
  }
})