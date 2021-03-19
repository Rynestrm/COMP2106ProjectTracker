const express = require('express');
const router = express.Router();

const Course = require("../models/course");

router.get('/add', (req, res, next) => {
   res.render('courses/add', {
    title: 'Add A Course',
    user:req.user
})
})

router.post('/add', (req, res, next) => {
   Course.create({
       courseCode: req.body.courseCode
   }, (err, newProject) => {
       if (err) {
           console.log(err)
       }
       else {
           res.redirect('/')
       }
   })
})

module.exports = router;