//require express
const express = require('express')
const router = express.Router()

// add project model for CRUD operations
const Project = require('../models/project')
const Course = require('../models/course')

//add passport for auth checking
const passport = require('passport');

//auth check for access control to CRUD methods
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next()//do the next thing in request
   }

   res.redirect('/login') //anonymous user tried to access a private page. send back to login
}

// get / projects
router.get('/', (req, res, next) => {
   res.render('projects/index', {title: 'My Projects'})
   //use project to fetch and display all projects
   Project.find((err, projects) => {
      if (err){
         console.log(err);
      }
      else {
         // now pass in the current user in the nav bar
         res.render('projects/index',{
            title: 'My Projects',
            projects: projects,
            user:req.user
         })
      }
   })
})

/* GET /projects/add */
router.get('/add', isLoggedIn, (req, res, next) => {
   // use Course model to fetch list of courses for dropdown
   Course.find((err, courses) => {
       if (err) {
           console.log(err)
       }
       else {
           res.render('projects/add', { 
               title: 'Project Details',
               courses: courses
           })            
       }
   }).sort({corseCode: 1})
})

//POST /projects/add
router.post('/add', isLoggedIn, (req, res, next) => {
   // use project model to save the form data to MongoDB
   Project.create({
      name: req.body.name,
      dueDate: req.body.dueDate,
      course: req.body.course
   }, (err, newProject) => {
      if (err){
         console.log(err);
      }
      else {
         // if successful redirect to projects index
         res.redirect('/projects')
      }
   })
})

// GET /projects/edit/
router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
   Project.findById(req.params._id, (err, project) => {
       if (err) {
           console.log(err)
       }
       else {
           // get courses for dropdown
           Course.find((err, courses) => {
               if (err) {
                   console.log(err)
               }
               else {
                   res.render('projects/edit', {
                       title: 'Project Details',
                       project: project,
                       courses: courses,
                       user:req.user
                   })  
               }
           }).sort({courseCode: 1})
       }
   })
})

// post /projects/edit/
router.post('/edit/:_id', isLoggedIn, (req, res, next) => {
   Project.findOneAndUpdate({ _id: req.params._id}, {
      name: req.body.name,
      dueDate: req.body.dueDate,
      course: req.body.course,
      status: req.body.status
   },(err, project) => {
      if(err){
         console.log(err);
      }else{
         res.redirect('/projects')
      }
   })
})

// make public
module.exports = router