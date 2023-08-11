const express = require('express')
const router = express.Router()
const Course = require('../models/course-model')
const multiparty = require('multiparty');


router.use('/', (req, res, next) => {
    console.log("正在接收一個course api請求.")
    next()
})

//取得所有課程
router.get('/', async (req, res) => {
    try {
        let foundCourse = await Course.find({}).populate('instructor', ["email", "username"])
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
//新增課程
router.post('/', async (req, res) => {

    try {
        if (!req.user.isInstructor()) {
            return res.send({
                msg: "fail",
                error: "只有講師才可新增課程"
            })
        }

        let form = new multiparty.Form({
            uploadDir: 'upload'
        });

        form.parse(req, async (err, fields, file) => {
            try {
                let title = fields.title[0]
                let description = fields.description[0]
                let price = fields.price[0]
                let pic = file.pic[0].path
                let instructor = req.user._id

                let newCourse = new Course({
                    title, description, price, pic, instructor
                })
                let saveCourse = await newCourse.save()
                return res.send({
                    msg: "success",
                    saveCourse
                })
            }
            catch (err) {
                return res.send({
                    msg: "fail",
                    error: err.message
                })
            }

        })
    }
    catch (err) {
        return res.send({
            msg: "fail",
            error: err.message
        })
    }
})
//取得講師個人課程
router.get('/instructor/:_id', async (req, res) => {
    let { _id } = req.params
    try {
        let foundCourse = await Course.find({ instructor: _id }).populate("instructor", ['username', 'email'])
        return res.send({
            mag: "success",
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
//修改課程
//刪除課程
router.delete('/:_id', async (req, res) => {
    let { _id } = req.params
    try {
        let foundCourde = await Course.findOne({ _id })
        if (!foundCourde.instructor.equals(req.user._id)) {
            return res.send({
                msg: 'fail',
                error: "只有課程講師可以刪除課程"
            })
        }
        else {
            await Course.findOneAndDelete({ _id })
            return res.send({
                msg: 'success',
            })
        }

    }
    catch (err) {
        return res.send({
            msg: "fail",
            error: err.message
        })
    }
})

//學生註冊課程
router.post('/addCourse/:_id', async (req, res) => {
    let { _id } = req.params
    try {
        let foundCourse = await Course.findOne({ _id })
        foundCourse.student.push(req.user._id)
        await foundCourse.save()
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

//取得學生註冊課程
router.get('/student/:_id', async (req, res) => {
    let { _id } = req.params
    try {
        let foundCourse = await Course.find({ student: _id }).populate('instructor', ["username", "email"])
        return res.send({
            msg: "success",
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