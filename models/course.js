const mongoose = require('mongoose')

//project schema
const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    }
})

//export schema so it is public
module.exports = mongoose.model('Course', courseSchema)