const express = require('express')
const router = express.Router()
const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const multiparty = require('multiparty');



router.use('/', (req, res, next) => {
    console.log("正在接收一個user api請求 .")
    next()
})

//註冊用戶
router.post('/register', async (req, res) => {

    try {
        let form = new multiparty.Form({
            uploadDir: 'upload'
        });

        form.parse(req, async (err, fields, file) => {
            try {
                let username = fields.username[0]
                let email = fields.email[0]
                let password = fields.password[0]
                let role = fields.role[0]
                let userPic = file.userpic[0].path

                let foundeEmail = await User.findOne({ email })
                if (foundeEmail) {
                    return res.send({
                        msg: 'fail',
                        error: "信箱已經存在，請重新輸入."
                    })
                }
                else {
                    if (password != "") {
                        let hashPassword = await bcrypt.hash(password, 12)
                        let newUser = new User({
                            username, email, role, password: hashPassword, userPic
                        })
                        let saveUser = await newUser.save()
                        return res.send({
                            msg: 'success',
                            user: saveUser
                        })
                    }
                    else {
                        return res.send({
                            msg: "fail",
                            error: "密碼為必填欄位."
                        })
                    }
                }

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

//用戶登入
router.post('/login', async (req, res) => {
    let { email, password } = req.body
    try {
        console.log(email, password)
        let foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.send({
                msg: "fail",
                error: "信箱輸入錯誤，請重新輸入."
            })
        }
        else {
            let checkPassword = await bcrypt.compare(password, foundUser.password)
            if (!checkPassword) {
                return res.send({
                    msg: "fail",
                    error: "密碼輸入錯誤，請重新輸入."
                })
            }
            else {
                //製作json web token
                let tokenObj = { _id: foundUser._id }
                let token = jwt.sign(tokenObj, process.env.PRIVATKEY);
                return res.send({
                    msg: "success",
                    token: "jwt " + token,
                    user: foundUser
                })
            }
        }
    }
    catch (err) {
        return res.send({
            msg: "fail",
            error: err.message
        })
    }
})

//取得講師
router.get('/instructor', async (rea, res) => {
    try {
        let foundUser = await User.find({ role: "instructor" })
        //数组中随机取出几个元素
        var newArr = [];
        for (var i = 0; i < 3; i++) {
            var index = Math.floor(Math.random() * foundUser.length);
            var item = foundUser[index];
            newArr.push(item)
            foundUser.splice(index, 1)
        }
        return res.send({
            msg: "success",
            user: newArr
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