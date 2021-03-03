// use express dependency and its routing feature to parse urls
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project Tracker' });
});

//GET /about
router.get('/about', (req, res, next) => {
  res.render('about', { 
    title: 'About',
    pageText: 'This is some dynamic text on a page.',
  });
});
router.get('/course', function(req, res, next) {
  res.render('course', { title: 'Courses' });
});

// exports makes the file public
module.exports = router;
