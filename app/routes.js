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
router.get( '/noticeofchange/startnoc', function (req, res)
{
    req.session.data['casenumber'] = '';
    req.session.data['errorcasenumber'] = 'false';

    req.session.data['role'] == 'undefined';
    req.session.data['errorrole'] = 'false';

    req.session.data['lastname'] == 'undefined'
    req.session.data['errorsecurityprobate'] = 'false';
    req.session.data['errorsecurityprobatewrongname'] = 'false';
    req.session.data['sot'] = 'undefined';

    req.session.data['day'] == '';
    req.session.data['month'] == '';
    req.session.data['year'] == '';
    req.session.data['errorsecuritydivorce'] = 'false';

    req.session.data['errorsot'] = 'false';

    res.redirect('/noticeofchange/solicitor/addenterdetails');
})


router.post( '/noticeofchange/solicitor/addenterdetails', function (req, res)
{
    //console.warn("Main Router " + req.session.data['casenumber'].length);
    if(req.session.data['casenumber'].length < 16  ||  20 < req.session.data['casenumber'].length )
    {
        req.session.data['errorcasenumber'] = 'true';
        //console.warn("Main Router " + req.session.data['errorcasenumber']);
        res.redirect('addenterdetails');
    }
    else
    {
        req.session.data['errorcasenumber'] = 'false';
        req.session.data['role'] = 'undefined';
        res.redirect('/noticeofchange/solicitor/selectroleprobate');
    }
})

router.post( '/noticeofchange/solicitor/selectroleprobate', function (req, res)
{
    if(req.session.data['role'] == 'undefined' )
    {
        req.session.data['errorrole'] = 'true';
        res.redirect('selectroleprobate');
    }
    else
    {
        req.session.data['errorrole'] = 'false';

        if(req.session.data['divorcecaselist'] == 'true' )
        {
            res.redirect('/noticeofchange/solicitor/securityquestiondivorce');
        }
        else
        {
            res.redirect('/noticeofchange/solicitor/securityquestionprobate');
        }

    }
})

router.post( '/noticeofchange/solicitor/securityquestionprobate', function (req, res)
{
    console.warn("Main Router  " + req.session.data['lastname']);
    if(req.session.data['lastname'] == 'undefined' )
    {
        req.session.data['errorsecurityprobate'] = 'true';
        res.redirect('securityquestionprobate');
    }
    else
    {
        if(req.session.data['lastname'] != 'Narran'  &&  req.session.data['lastname'] != 'narran' )
        {
            req.session.data['errorsecurityprobatewrongname'] = 'true';
            res.redirect('securityquestionprobate');
        }
        else
        {
            req.session.data['errorsecurityprobate'] = 'false';
            req.session.data['errorsecurityprobatewrongname'] = 'false';
            req.session.data['sot'] = 'undefined';
            res.redirect('/noticeofchange/solicitor/checkanswers');
        }
    }
})


router.post( '/noticeofchange/solicitor/securityquestiondivorce', function (req, res)
{
    console.warn("Main Router  " + req.session.data['day']);
    if(req.session.data['day'] == ''  ||
        req.session.data['month'] == '' ||
        req.session.data['year'] == ''  )
    {
        req.session.data['errorsecuritydivorce'] = 'true';
        res.redirect('securityquestiondivorce');
    }
    else
    {
        var months = ['filler', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        req.session.data['monthoutput'] = months[req.session.data['month']];
        console.warn("Main Router " + req.session.data['monthoutput']);

        req.session.data['errorsecuritydivorce'] = 'false';
        req.session.data['sot'] = 'undefined';
        res.redirect('/noticeofchange/solicitor/checkanswers');
    }
})



router.post( '/noticeofchange/solicitor/checkanswers', function (req, res)
{
    console.warn("Main Router +" + req.session.data['sot']  + "+++");
    console.warn("****************************");
    if(req.session.data['sot'] != 'on' )
    {
        req.session.data['errorsot'] = 'true';
        res.redirect('checkanswers');
    }
    else
    {
        req.session.data['errorsot'] = 'false';
        res.redirect('/noticeofchange/solicitor/confirmation?autoapproved=true&');
    }
})



// STOP REPRESENTING CLIENT
router.post( '/noticeofchange/solicitor/casedetailsprobate', function (req, res)
{

    req.session.data['stopstop'] = '';

    res.redirect('/noticeofchange/solicitor/confirmstop');
})

router.post( '/noticeofchange/solicitor/casedetailsdivorce', function (req, res)
{

    req.session.data['stopstop'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/solicitor/confirmstop');
})


router.post( '/noticeofchange/solicitor/casedetailsimmigration', function (req, res)
{

    req.session.data['stopstop'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/solicitor/confirmstop');
})



router.post( '/noticeofchange/solicitor/confirmstop', function (req, res)
{
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");
    if(req.session.data['stopstop'] != 'on' )
    {
        req.session.data['errorstopconfirm'] = 'true';
        res.redirect('confirmstop');
    }
    else
    {
        req.session.data['errorstopconfirm'] = 'false';
        res.redirect('/noticeofchange/solicitor/confirmationofstopping');
    }
})



// NOT USED AS ROLE SEEMS TO BE WHO THEY ARE REPRESENTING
router.post( '/noticeofchange/solicitor/selectrole', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/checkanswers');
})
