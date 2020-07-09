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
    res.redirect('/noticeofchange/solicitor/selectroleprobate');
})

router.post( '/noticeofchange/solicitor/selectroleprobate', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/securityquestionprobate');
})

router.post( '/noticeofchange/solicitor/securityquestionprobate', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/checkanswers');
})

router.post( '/noticeofchange/solicitor/checkanswers', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/confirmation?autoapproved=true&');
})

// STOP REPRESENTING CLIENT
router.post( '/noticeofchange/solicitor/casedetails', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/confirmstop');
})
router.post( '/noticeofchange/solicitor/confirmstop', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/confirmationofstopping');
})

// NOT USED AS ROLE SEEMS TO BE WHO THEY ARE REPRESENTING
router.post( '/noticeofchange/solicitor/selectrole', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/checkanswers');
})
