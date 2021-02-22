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







//  CASE SEARCH
// Start new search
router.get( '/searchcases/pages/startsearch', function (req, res)
{
    req.session.data['errorcasenumber'] = 'false';
    req.session.data['errorpostcodeinvalid'] = 'false';
    req.session.data['erroremail'] = 'false';
    req.session.data['errorallfieldsempty'] = 'false';

    req.session.data['hmctsref'] = '';
    req.session.data['otherref'] = '';
    req.session.data['names'] = '';
    req.session.data['postcode'] = '';
    req.session.data['email'] = '';

    res.redirect('/searchcases/pages/search');
})

// If the user enters a ccd reference number then take them directly to the case
router.post( '/searchcases/pages/search', function (req, res)
{
    // set results to show normal amount, NOT 'many results'
    req.session.data['results'] = 'few';

    // Set the error state to normal
    req.session.data['errorcasenumber'] = 'false';
    req.session.data['errorpostcodeinvalid'] = 'false';
    req.session.data['erroremail'] = 'false';

    // Check if the user has entered an HMCTS reference
    if(req.session.data['hmctsref'] == '')
    {
        //If no reference is entered then we make one up for them
        req.session.data['casereference'] = '8771785741275065';

        // If a postcode is entered we validate against it
        if(req.session.data['postcode'] != '')
        {
            if (req.session.data['postcode'].length < 6  ||  9 < req.session.data['postcode'].length)
            {
                req.session.data['errorpostcodeinvalid'] = 'true';
                res.redirect('/searchcases/pages/search');
            }
            else
            {
                // Postcode is valid so continue to results
            }
        }

        // If a postcode is entered we validate against it
        if(req.session.data['email'] != '')
        {
            //console.log( "content is " + req.session.data['email'].includes("@"));

            // Check email contains correct symbols
            if( req.session.data['email'].includes("@") == false )
            {
                req.session.data['erroremail'] = 'true';
                res.redirect('/searchcases/pages/search');
            }
            else
            {
                // email is valid so continue to results
            }
        }

        res.redirect('/searchcases/pages/results');
    }
    else
    {
        // if the hmcts reference is too short or too long them reload the page with an exception
        if(req.session.data['hmctsref'].length < 16  ||  20 < req.session.data['hmctsref'].length )
        {
            req.session.data['errorcasenumber'] = 'true';
            //console.warn("Main Router " + req.session.data['errorcasenumber']);
            res.redirect('/searchcases/pages/search');
        }
        else
        {
            // if the hmcts reference is valid then go straight to the case
            req.session.data['casereference'] = req.session.data['hmctsref'];
            res.redirect('/searchcases/pages/casedetailsdivorce');
        }
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

////////////////////////////////////////////////////////////////////////////////////////////////
// Version 1 - No longer in use
router.get( '/noticeofchange/v1/startnoc', function (req, res)
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

    res.redirect('/noticeofchange/v1/solicitor/addenterdetails');
})


router.post( '/noticeofchange/v1/solicitor/addenterdetails', function (req, res)
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
        res.redirect('/noticeofchange/v1/solicitor/selectroleprobate');
    }
})

router.post( '/noticeofchange/v1/solicitor/selectroleprobate', function (req, res)
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
            res.redirect('/noticeofchange/v1/solicitor/securityquestiondivorce');
        }
        else
        {
            res.redirect('/noticeofchange/v1/solicitor/securityquestionprobate');
        }

    }
})

router.post( '/noticeofchange/v1/solicitor/securityquestionprobate', function (req, res)
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
            res.redirect('/noticeofchange/v1/solicitor/checkanswers');
        }
    }
})

router.post( '/noticeofchange/v1/solicitor/securityquestiondivorce', function (req, res)
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
        res.redirect('/noticeofchange/v1/solicitor/checkanswers');
    }
})

router.post( '/noticeofchange/v1/solicitor/checkanswers', function (req, res)
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
        res.redirect('/noticeofchange/v1/solicitor/confirmation?autoapproved=true&');
    }
})


// STOP REPRESENTING CLIENT
router.post( '/noticeofchange/v1/solicitor/casedetailsprobate', function (req, res)
{

    req.session.data['stopstop'] = '';

    res.redirect('/noticeofchange/v1/solicitor/confirmstop');
})

router.post( '/noticeofchange/v1/solicitor/casedetailsdivorce', function (req, res)
{

    req.session.data['stopstop'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/v1/solicitor/confirmstop');
})

router.post( '/noticeofchange/v1/solicitor/confirmstop', function (req, res)
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
        res.redirect('/noticeofchange/v1/solicitor/confirmationofstopping?stoppingoutcome=auto&');
    }
})

// NOT USED AS ROLE SEEMS TO BE WHO THEY ARE REPRESENTING
router.post( '/noticeofchange/v1/solicitor/selectrole', function (req, res)
{
    res.redirect('/noticeofchange/v1/solicitor/checkanswers');
})




////////////////////////////////////////////////////////////////////////////////////////////////
// Version 2 - No longer in use
router.get( '/noticeofchange/v2/startnoc', function (req, res)
{
    req.session.data['casenumber'] = '';
    req.session.data['errorcasenumber'] = 'false';

    req.session.data['role'] == 'undefined';
    req.session.data['errorrole'] = 'false';

    req.session.data['lastname'] = 'undefined'
    req.session.data['errorsecurityprobate'] = 'false';
    req.session.data['errorsecurityprobatewrongname'] = 'false';
    req.session.data['sot'] = 'undefined';

    req.session.data['day'] = '';
    req.session.data['month'] = '';
    req.session.data['year'] = '';
    req.session.data['errorsecuritydivorce'] = 'false';

    req.session.data['errorsot'] = 'false';

    res.redirect('/noticeofchange/v2/solicitor/addenterdetails');
})

router.post( '/noticeofchange/v2/solicitor/addenterdetails', function (req, res)
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


        if(req.session.data['caselist'] == 'probate')
        {
            res.redirect('/noticeofchange/v2/solicitor/selectroleprobate');
        }
        else
        {
            req.session.data['caselist'] = 'divorce';
            res.redirect('/noticeofchange/v2/solicitor/selectroledivorce');
        }
    }
})

router.post( '/noticeofchange/v2/solicitor/selectroleprobate', function (req, res)
{
    if(req.session.data['role'] == 'undefined' )
    {
        req.session.data['errorrole'] = 'true';
        res.redirect('selectroleprobate');
    }
    else
    {
        req.session.data['errorrole'] = 'false';

        res.redirect('/noticeofchange/v2/solicitor/securityquestionprobate');
    }
})

router.post( '/noticeofchange/v2/solicitor/selectroledivorce', function (req, res)
{
    if(req.session.data['role'] == 'undefined' )
    {
        req.session.data['errorrole'] = 'true';
        res.redirect('selectroledivorce');
    }
    else
    {
        req.session.data['errorrole'] = 'false';

        res.redirect('/noticeofchange/v2/solicitor/securityquestiondivorce');
    }
})

router.post( '/noticeofchange/v2/solicitor/securityquestionprobate', function (req, res)
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
            res.redirect('/noticeofchange/v2/solicitor/checkanswers');
        }
    }
})

router.post( '/noticeofchange/v2/solicitor/securityquestiondivorce', function (req, res)
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
        res.redirect('/noticeofchange/v2/solicitor/checkanswers');
    }
})

router.post( '/noticeofchange/v2/solicitor/checkanswers', function (req, res)
{
    console.warn("Main Router +" + req.session.data['sot']  + "+++");
    console.warn("****************************");
    if(req.session.data['solicitorhasalready'] == 'true' )
    {
        // where solicitor in firm already has case
        res.redirect('alreadygotcaseerror');
    }
    else if(req.session.data['sot'] != 'on' )
    {
        req.session.data['errorsot'] = 'true';
        res.redirect('checkanswers');
    }
    else
    {
        // Sort out the data and time of right now
        var months = ['filler', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        var currentDate = new Date()
        var day = currentDate.getDate()
        var monthtoday = currentDate.getMonth() + 1
        var year = currentDate.getFullYear()

        var timenowis = currentDate.toLocaleString('en-US', { hour: 'numeric',  minute: 'numeric', second: 'numeric', hour12: true })

        req.session.data['todaydate'] = day + " " + months[monthtoday] + " " + year;
        req.session.data['todaydatetime'] = timenowis;
        req.session.data['errorsot'] = 'false';
        req.session.data['casenumberselected'] = req.session.data['casenumber'];
        req.session.data['caseadded'] = 'true';
        req.session.data['adminonly'] = 'true';
        res.redirect('/noticeofchange/v2/solicitor/confirmation?autoapproved=true&adminonly=false&servicedown=false&');
    }
})



// STOP REPRESENTING CLIENT - V2
router.post( '/noticeofchange/v2/solicitor/casedetailsprobate', function (req, res)
{
    req.session.data['stopstop'] = '';

    res.redirect('/noticeofchange/v2/solicitor/stopselectclients');
})

router.post( '/noticeofchange/v2/solicitor/casedetailsdivorce', function (req, res)
{
    req.session.data['stopstop'] = '';
    req.session.data['stoppingmoredetail'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/v2/solicitor/stopselectclients');
})

router.post( '/noticeofchange/v2/solicitor/casedetailsimmigration', function (req, res)
{
    req.session.data['stopstop'] = '';
    req.session.data['stoppingmoredetail'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/v2/solicitor/stopselectclients');
})

router.post( '/noticeofchange/v2/solicitor/casedetailspubliclaw', function (req, res)
{
    req.session.data['stopstop'] = '';
    req.session.data['stoppingmoredetail'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/v2/solicitor/stopselectclients');
})

router.post( '/noticeofchange/v2/solicitor/stopselectclients', function (req, res)
{
    if(req.session.data['clientselected'] != 'on' )
    {
        req.session.data['errorstopnoperson'] = 'true';
        res.redirect('stopselectclients');
    }
    else
    {
        req.session.data['errorstopnoperson'] = 'false';
        res.redirect('/noticeofchange/v2/solicitor/stopreason');
    }

})

router.post( '/noticeofchange/v2/solicitor/stopreason', function (req, res)
{
    res.redirect('/noticeofchange/v2/solicitor/confirmstop');
})

router.post( '/noticeofchange/v2/solicitor/confirmstop', function (req, res)
{
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    console.warn("case to hide  +" + req.session.data['casetohide']  + "+++");
    if (req.session.data['casetohide'] == 'a')
    {
        req.session.data['hideone'] = 'true';
    }
    else if (req.session.data['casetohide'] == 'b')
    {
        req.session.data['hidetwo'] = 'true';
    }
    else if (req.session.data['casetohide'] == 'c')
    {
        req.session.data['hidethree'] = 'true';
    }

    // Redirect to correct confirmation style
    res.redirect('/noticeofchange/v2/solicitor/confirmationofstopping');



})



















////////////////////////////////////////////////////////////////////////////////////////////////
// Latest version
router.get( '/noticeofchange/startnoc', function (req, res)
{
    // Resetting all the data before the user starts
    req.session.data['casenumber'] = '';
    req.session.data['errorcasenumber'] = 'false';
    req.session.data['serviceeligibilityerror'] = 'false';

    req.session.data['role'] == 'undefined';
    req.session.data['errorrole'] = 'false';

    req.session.data['title'] = '';
    req.session.data['firstname'] = '';
    req.session.data['lastname'] = '';
    req.session.data['errorsecurityprobate'] = 'false';
    req.session.data['errorsecurityprobatewrongname'] = 'false';
    req.session.data['sot'] = 'undefined';

    req.session.data['errorsecuritydivorce'] = 'false';
    req.session.data['errorsecuritydivorcefirstname'] = 'false';
    req.session.data['errorsecuritydivorcelastname'] = 'false';

    req.session.data['errorsecurityprobate'] = 'false';

    req.session.data['errorsecurityprobatetitle'] = 'false';
    req.session.data['errorsecurityprobatefirstname'] = 'false';
    req.session.data['errorsecurityprobatelastname'] = 'false';

    req.session.data['errorsecurityprobatedate'] = 'false';
    req.session.data['errorsecurityprobatedateday'] = 'false';
    req.session.data['errorsecurityprobatedatemonth'] = 'false';
    req.session.data['errorsecurityprobatedateyear'] = 'false';


    req.session.data['day'] = '';
    req.session.data['month'] = '';
    req.session.data['year'] = '';
    req.session.data['errorsecuritydivorce'] = 'false';

    req.session.data['errornomatch'] = 'false';

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


        if(req.session.data['caselist'] == 'probate')
        {
            res.redirect('/noticeofchange/solicitor/securityquestionprobate');
        }
        else
        {
            req.session.data['caselist'] = 'divorce';
            res.redirect('/noticeofchange/solicitor/securityquestiondivorce');
        }
    }
})

router.post( '/noticeofchange/solicitor/selectroleprobate', function (req, res)
{
    console.warn("orobate radio selection +" + req.session.data['role']  + "+++");
    if(req.session.data['role'] == 'undefined' )
    {
        req.session.data['errorrole'] = 'true';
        res.redirect('selectroleprobate');
    }
    else
    {
        req.session.data['errorrole'] = 'false';

        res.redirect('/noticeofchange/solicitor/securityquestionprobate');
    }
})

router.post( '/noticeofchange/solicitor/selectroledivorce', function (req, res)
{
    if(req.session.data['role'] == 'undefined' )
    {
        req.session.data['errorrole'] = 'true';
        res.redirect('selectroledivorce');
    }
    else
    {
        req.session.data['errorrole'] = 'false';

        res.redirect('/noticeofchange/solicitor/securityquestiondivorce');
    }
})

router.post( '/noticeofchange/solicitor/securityquestionprobate', function (req, res)
{

    console.warn("Main Router THE NAME IS " + req.session.data['lastname']);

    if(req.session.data['firstname'] == 'Joe'  ||  req.session.data['firstname'] == 'joe')
    {
        req.session.data['errorsecurityprobate'] = 'true';
        req.session.data['errornomatch'] = 'true';

        req.session.data['errorsecurityprobatetitle'] = 'false';
        req.session.data['errorsecurityprobatefirstname'] = 'false';
        req.session.data['errorsecurityprobatelastname'] = 'false';
        req.session.data['errorsecurityprobatedate'] = 'false';

        req.session.data['errorsecurityprobatedateday'] = 'false';
        req.session.data['errorsecurityprobatedatemonth'] = 'false';
        req.session.data['errorsecurityprobatedateyear'] = 'false';

        res.redirect('securityquestionprobate');
    }

    else if(req.session.data['lastname'] == '' || req.session.data['firstname'] == '' || req.session.data['title'] == '' ||
        req.session.data['day'] == ''  ||
        req.session.data['month'] == '' ||
        req.session.data['year'] == ''  )
    {
        req.session.data['errornomatch'] = 'false';
        req.session.data['errorsecurityprobate'] = 'true'
        if(req.session.data['title'] == '')
        {
            req.session.data['errorsecurityprobatetitle'] = 'true'
        }
        else
        {
            req.session.data['errorsecurityprobatetitle'] = 'false';
        }
        if(req.session.data['firstname'] == '')
        {
            req.session.data['errorsecurityprobatefirstname'] = 'true'
        }
        else
        {
            req.session.data['errorsecurityprobatefirstname'] = 'false';
        }
        if(req.session.data['lastname'] == '')
        {
            req.session.data['errorsecurityprobatelastname'] = 'true'
        }
        else
        {
            req.session.data['errorsecurityprobatelastname'] = 'false';
        }

        if(req.session.data['day'] == '')
        {
            req.session.data['errorsecurityprobatedate'] = 'true'
            req.session.data['errorsecurityprobatedateday'] = 'true'
        }
        else
        {
            req.session.data['errorsecurityprobatedateday'] = 'false';
        }
        if(req.session.data['month'] == '')
        {
            req.session.data['errorsecurityprobatedate'] = 'true'
            req.session.data['errorsecurityprobatedatemonth'] = 'true'
        }
        else
        {
            req.session.data['errorsecurityprobatedatemonth'] = 'false';
        }
        if(req.session.data['year'] == '')
        {
            req.session.data['errorsecurityprobatedate'] = 'true'
            req.session.data['errorsecurityprobatedateyear'] = 'true'
        }
        else
        {
            req.session.data['errorsecurityprobatedateyear'] = 'false';
        }

        //  The date has no errors
        if(req.session.data['day'] != ''  &&
            req.session.data['month'] != '' &&
            req.session.data['year'] != ''  )
        {
            req.session.data['errorsecurityprobatedate'] = 'false'
        }

        res.redirect('securityquestionprobate');
    }
    else
    {
        req.session.data['tempmonthdateformat'] = req.session.data['month'];
        //work with 01 month format
        console.warn("Date substring is :  " +  req.session.data['tempmonthdateformat'].substring(0, 1));
        if(req.session.data['tempmonthdateformat'].substring(0, 1) == '0')
        {
            req.session.data['tempmonthdateformat'] = req.session.data['tempmonthdateformat'].substring(1, 2)
            console.warn("BRAND NEW  date is :  " +  req.session.data['tempmonthdateformat']);
        }

        var months = ['filler', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        req.session.data['monthoutput'] = months[req.session.data['tempmonthdateformat']];
        console.warn("Main Router " + req.session.data['monthoutput']);


        // Clear all the errors
        req.session.data['errorsecurityprobate'] = 'false';

        req.session.data['errorsecurityprobatetitle'] = 'false';
        req.session.data['errorsecurityprobatefirstname'] = 'false';
        req.session.data['errorsecurityprobatelastname'] = 'false';

        req.session.data['errorsecurityprobatedate'] = 'false'
        req.session.data['errorsecurityprobatedateday'] = 'false';
        req.session.data['errorsecurityprobatedatemonth'] = 'false';
        req.session.data['errorsecurityprobatedateyear'] = 'false';

        res.redirect('/noticeofchange/solicitor/checkanswers');

    }


})

router.post( '/noticeofchange/solicitor/securityquestiondivorce', function (req, res)
{
    console.warn("Main Router THE NAME IS " + req.session.data['lastname']);

    if(req.session.data['firstname'] == 'Joe'  ||  req.session.data['firstname'] == 'joe')
    {
        req.session.data['errorsecuritydivorce'] = 'true';
        req.session.data['errornomatch'] = 'true';

        req.session.data['errorsecuritydivorcefirstname'] = 'false';
        req.session.data['errorsecuritydivorcelastname'] = 'false';

        res.redirect('securityquestiondivorce');
    }
    else if(req.session.data['lastname'] == '' || req.session.data['firstname'] == '')
    {
        req.session.data['errorsecuritydivorce'] = 'true'
        req.session.data['errornomatch'] = 'false';
        if(req.session.data['firstname'] == '')
        {
            req.session.data['errorsecuritydivorcefirstname'] = 'true'
        }
        else
        {
            req.session.data['errorsecuritydivorcefirstname'] = 'false';
        }
        if(req.session.data['lastname'] == '')
        {
            req.session.data['errorsecuritydivorcelastname'] = 'true'
        }
        else
        {
            req.session.data['errorsecuritydivorcelastname'] = 'false';
        }

        res.redirect('securityquestiondivorce');
    }
    else
    {
            req.session.data['errorsecuritydivorce'] = 'false';
            req.session.data['errorsecuritydivorcefirstname'] = 'false';
            req.session.data['errorsecuritydivorcelastname'] = 'false';
            res.redirect('/noticeofchange/solicitor/checkanswers');

    }

    /*
    if(req.session.data['day'] == ''  ||
        req.session.data['month'] == '' ||
        req.session.data['year'] == ''  )
    {
        req.session.data['errorsecuritydivorce'] = 'true';
        res.redirect('securityquestiondivorce');
    }
    else
    {
        req.session.data['tempmonthdateformat'] = req.session.data['month'];
        //work with 01 month format
        console.warn("Date substring is :  " +  req.session.data['tempmonthdateformat'].substring(0, 1));
        if(req.session.data['tempmonthdateformat'].substring(0, 1) == '0')
        {
            req.session.data['tempmonthdateformat'] = req.session.data['tempmonthdateformat'].substring(1, 2)
            console.warn("BRAND NEW  date is :  " +  req.session.data['tempmonthdateformat']);
        }

        var months = ['filler', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        req.session.data['monthoutput'] = months[req.session.data['tempmonthdateformat']];
        console.warn("Main Router " + req.session.data['monthoutput']);

        req.session.data['errorsecuritydivorce'] = 'false';
        req.session.data['sot'] = 'undefined';
        res.redirect('/noticeofchange/solicitor/checkanswers');
    }

    */
})

router.post( '/noticeofchange/solicitor/checkanswers', function (req, res)
{
    console.warn("Main Router +" + req.session.data['sot']  + "+++");
    console.warn("****************************");
    if(req.session.data['solicitorhasalready'] == 'true' )
    {
        // where solicitor in firm already has case
        res.redirect('alreadygotcaseerror');
    }
    else if(req.session.data['sot'] != 'on'  ||   req.session.data['noticecheckbox'] != 'on' )
    {
        if(req.session.data['sot'] != 'on')
        {
            req.session.data['errorsot'] = 'true';
        }
        else
        {
            req.session.data['errorsot'] = 'false';
        }

        if(req.session.data['noticecheckbox'] != 'on' )
        {
            req.session.data['errorgivennotice'] = 'true';
        }
        else
        {
            req.session.data['errorgivennotice'] = 'false';
        }

        res.redirect('checkanswers');
    }
    else
    {
        // Sort out the data and time of right now
        var months = ['filler', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        var currentDate = new Date()
        var day = currentDate.getDate()
        var monthtoday = currentDate.getMonth() + 1
        var year = currentDate.getFullYear()

        var timenowis = currentDate.toLocaleString('en-US', { hour: 'numeric',  minute: 'numeric', second: 'numeric', hour12: true })

        req.session.data['todaydate'] = day + " " + months[monthtoday] + " " + year;
        req.session.data['todaydatetime'] = timenowis;
        req.session.data['errorsot'] = 'false';
        req.session.data['errorgivennotice'] = 'false';
        req.session.data['casenumberselected'] = req.session.data['casenumber'];
        req.session.data['caseadded'] = 'true';
        req.session.data['adminonly'] = 'true';
        res.redirect('/noticeofchange/solicitor/confirmation?autoapproved=true&adminonly=false&servicedown=false&');
    }
})



// STOP REPRESENTING CLIENT
router.post( '/noticeofchange/solicitor/casedetailsprobate', function (req, res)
{
    req.session.data['stopstop'] = '';

    res.redirect('/noticeofchange/solicitor/stopselectclients');
})

router.post( '/noticeofchange/solicitor/casedetailsdivorce', function (req, res)
{
    req.session.data['stopstop'] = '';
    req.session.data['stoppingmoredetail'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/solicitor/stopselectclients');
})

router.post( '/noticeofchange/solicitor/casedetailsimmigration', function (req, res)
{
    req.session.data['stopstop'] = '';
    req.session.data['stoppingmoredetail'] = '';
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/solicitor/stopselectclients');
})

router.post( '/noticeofchange/solicitor/casedetailspubliclaw', function (req, res)
{
    req.session.data['stopstop'] = '';
    req.session.data['stoppingmoredetail'] = '';
    req.session.data['clientselected'] = 'undefined'
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

    res.redirect('/noticeofchange/solicitor/stopselectclients');
})

router.post( '/noticeofchange/solicitor/stopselectclients', function (req, res)
{
    console.warn("stop client selected +" + req.session.data['clientselectedradio']  + "+++");

    if(req.session.data['clientselectedradio'] == 'undefined' )
    {
        req.session.data['errorstopnoperson'] = 'true';
        res.redirect('stopselectclients');
    }
    else
    {
        req.session.data['errorstopnoperson'] = 'false';
        res.redirect('/noticeofchange/solicitor/stopsot');
    }

})

router.post( '/noticeofchange/solicitor/stopreason', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/stopsot');
})


router.post( '/noticeofchange/solicitor/stopsot', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/confirmstop');
})


router.post( '/noticeofchange/solicitor/confirmstop', function (req, res)
{
    console.warn("stop checkbox +" + req.session.data['stopstop']  + "+++");

        console.warn("case to hide  +" + req.session.data['casetohide']  + "+++");
        if (req.session.data['casetohide'] == 'a')
        {
            req.session.data['hideone'] = 'true';
        }
        else if (req.session.data['casetohide'] == 'b')
        {
            req.session.data['hidetwo'] = 'true';
        }
        else if (req.session.data['casetohide'] == 'c')
        {
            req.session.data['hidethree'] = 'true';
        }

        // Redirect to correct confirmation style
            res.redirect('/noticeofchange/solicitor/confirmationofstopping');



})



// NOT USED AS ROLE SEEMS TO BE WHO THEY ARE REPRESENTING
router.post( '/noticeofchange/solicitor/selectrole', function (req, res)
{
    res.redirect('/noticeofchange/solicitor/checkanswers');
})








//////////////////////////////////////////////////////////////////////////////////
////////////// SEARCH FOR ORG FOR A CITIZEN DICORCE APPLENT //////////////////////
//////////////////////////////////////////////////////////////////////////////////


router.post( '/searchorgs/search/divorce1', function (req, res)
{
    if(req.session.data['represented'] == 'yes')
    {
        res.redirect('/searchorgs/search/divorce2');
    }
    else
    {
        res.redirect('/searchorgs/search/therestofapplication');
    }
})


router.post( '/searchorgs/search/divorce2', function (req, res)
{
    if(req.session.data['firmname'] == 'yes')
    {
        res.redirect('/searchorgs/search/divorce3');
    }
    else
    {
        res.redirect('/searchorgs/search/therestofapplication');
    }
})


router.post( '/searchorgs/search/divorce3', function (req, res)
{
    res.redirect('/searchorgs/search/therestofapplication');
})




//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
