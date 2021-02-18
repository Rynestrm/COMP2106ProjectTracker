// refernece mongoose
const mongoose = require('mongoose')

// define project schema
var projectSchema = new mongoose.SchemaType({
   name: {
      type: String,
      required: true
   },
   dueDate: {
      type: date
   },
   course: {
      type: String,
      required: true
   },
   status:{
      type: String,
   }
})

//export schema to be public and visible to the controller.
module.exports = mongoose.model('Project', projectSchema)