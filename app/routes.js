const express = require('express')
const router = express.Router()

router.use('/', require('./routes/base'));

module.exports = router



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




// NOTICE OF CHANGE
router.post( '/noticeofchange/solicitor/startorstop', function (req, res)
{
  if(req.session.data['startorstop'] == 'start')
  {
    res.redirect('/noticeofchange/solicitor/addenterdetails');
  }
  else
  {
    res.redirect('/noticeofchange/solicitor/caselist');
  }
})


// NOTICE OF CHANGE
router.post( '/noticeofchange/solicitor/addenterdetails', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/reviewcase');
})

router.post( '/noticeofchange/solicitor/reviewcase', function (req, res)
{
  res.redirect('/noticeofchange/solicitor/selectparty');
})

router.post( '/noticeofchange/solicitor/selectparty', function (req, res)
{
  res.redirect('/noticeofchange/solicitor/selectrole');
})

router.post( '/noticeofchange/solicitor/selectrole', function (req, res)
{
  res.redirect('/noticeofchange/solicitor/checkanswers');
})
