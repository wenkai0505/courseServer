const mongoose = require('mongoose')
const { Schema } = mongoose


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "用戶名稱為必填欄位"],
        minLength: [3, "用戶名稱不可少於3個字元"],
        maxLength: [50, "用戶名稱不可大於50個字元"]
    },
    email: {
        type: String,
        required: [true, "用戶信箱為必填欄位"],
        minLength: [3, "用戶名稱不可少於6個字元"],
        maxLength: [50, "用戶名稱不可大於50個字元"]
    },
    password: {
        type: String,
        required: [true, "用戶密碼為必填欄位"]
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: [true, "用戶身份為必填欄位"],
    },
    date: {
        type: Date,
        default: Date.now
    },
    userPic: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.isStudent = function () {
    return this.role == "student"

}
userSchema.methods.isInstructor = function () {
    return this.role == "instructor"
}


const User = mongoose.model('User', userSchema)
module.exports = User