const express = require('express')
const router = express.Router()
const Course = require('../models/course-model')


router.use('/', (req, res, next) => {
    console.log("正在接收一個filter course api 請求 ")
    next()
})

router.get('/', async (req, res) => {
    try {
        let foundCourse = await Course.aggregate([{ $sample: { size: 4 } }])
        return res.send({
            msg: 'success',
            course: foundCourse

        })
    }
    catch (err) {
        return res.send({
            msg: "fail",
            error: err.message
        })
    }

})



module.exports = router