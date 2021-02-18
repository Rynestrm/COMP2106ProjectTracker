//require express
const express = require('express')
const project = require('../models/project')
const router = express.Router()

// add project model for CRUD operations
// const mongoose = require('mongoose')
const Project = require('../models/project')

// get / projects
router.get('/', (req, res, next) => {
   res.render('projects/index', {title: 'My Projects'})
   //use project to fetch and display all projects
   Project.find((err, projects) => {
      if (err){
         console.log(err);
      }
      else {
         res.render('projects/index',{
            title: 'My Projects',
            projects: projects
         })
      }
   })
})

//GET / projects/add
router.get('/add', (req, res, next) => {
   res.render('projects/add', {title: 'Project Details'})
})

//POST /projects/add
router.post('/add', (req, res, next) => {
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

// make public
module.exports = router