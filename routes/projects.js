//require express
const express = require('express')
const router = express.Router()

// get / projects
router.get('/', (req, res, next) => {
   res.render('projects/index', {title: 'My Projects'})
})

// make public
module.exports = router