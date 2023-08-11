const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const userRoute = require('./routes/user-route')
const courseRoute = require('./routes/course-route')
const filterCourseRouter = require('./routes/filterCourse-route')
const passport = require('passport')
require('./config/passport')
const cors = require('cors')

let port = process.env.PORT || 8080

mongoose.connect(process.env.MONGODBCONNECT)
    .then(() => {
        console.log("Connect to MongoDB Atlas success.")
    })
    .catch((err) => {
        console.log("connect to MongoDB fail")
        console.log(err)
    })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static('upload'))
app.use('/api/user', userRoute)
app.use('/api/filterCourse', filterCourseRouter)
app.use('/api/course', passport.authenticate('jwt', { session: false }), courseRoute)


app.listen(port, (req, res) => {
    console.log("Server is running on port 8080 . ")
})